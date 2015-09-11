<?php

namespace Andrewboy\SearchBox\Traits;

trait SearchTrait
{

    public function scopeSearch($query, array $params)
    {
        foreach ($params as $key => $values) {

            if (!isset($values['search'])) {
                continue;
            }

            $realKey = substr($key, 7);

            if (false !== $realKey && in_array($realKey, array_keys(static::$searchParams))) {

                switch (static::$searchParams[$realKey]['type']) {

                    case 'integer':
                        $this->setIntegerSearchQuery($query, $realKey, $values);
                        break;

                    case 'date':
                        $this->setDateSearchQuery($query, $realKey, $values);
                        break;

                    case 'string':
                        $this->setStringSearchQuery($query, $realKey, $values);
                        break;

                    case 'boolean':
                        $this->setBooleanSearchQuery($query, $realKey, $values);
                        break;

                    case 'list':
                        $this->setListSearchQuery($query, $realKey, $values);
                        break;
                }
            }
        }
    }

    protected function setIntegerSearchQuery($query, $key, array $values)
    {
        switch ($values['operator']) {
            case '=':
            case '>=':
            case '<=':
            case '!=':
                $query->where($key, $values['operator'], "{$values['values'][0]}");
                break;

            case '><':
                $query->where($key, '>', "{$values['values'][0]}")
                        ->where($key, '<', "{$values['values'][1]}");
                break;
        }
    }

    protected function setDateSearchQuery($query, $key, array $values)
    {
        switch ($values['operator']) {
            case '=':
                $query->where($key, 'LIKE', "%{$values['values'][0]}%");
                break;

            case '>=':
            case '<=':
                $query->where($key, $values['operator'], "{$values['values'][0]}");
                break;

            case '><':
                $query->where($key, '>', "{$values['values'][0]}")
                        ->where($key, '<', "{$values['values'][1]}");
                break;
        }
    }

    protected function setStringSearchQuery($query, $key, array $values)
    {
        switch ($values['operator']) {
            case '~':
                $query->where($key, 'LIKE', "%{$values['values'][0]}%");
                break;

            case '!~':
                $query->where($key, 'NOT LIKE', "%{$values['values'][0]}%");
                break;
        }
    }

    protected function setBooleanSearchQuery($query, $key, array $values)
    {
        switch ($values['operator']) {
            case '=':
                $query->where($key, 'LIKE', "{$values['values'][0]}");
                break;

            case '!=':
                $query->where($key, 'NOT LIKE', "{$values['values'][0]}");
                break;
        }
    }

    protected function setListSearchQuery($query, $key, array $values)
    {
        switch ($values['operator']) {
            case '=':
                $ids = $values['values'];
                $query->whereHas(static::$searchParams[$key]['relation'][0], function($q) use($ids) {
                    $q->whereIn('id', $ids);
                }, '>', 0);
                break;

            case '!=':
                $ids = $values['values'];
                $query->whereHas(static::$searchParams[$key]['relation'][0], function($q) use($ids) {
                    $q->whereNotIn('id', $ids);
                });
                break;
        }
    }

    public static function getSearchSet($url)
    {
        $searchParams = [];

        foreach (static::$searchParams as $key => $searchParam) {
            $searchParams[$key] = $searchParam;
            if ('list' === $searchParam['type']) {
                $self = new self;
                $relationClass = get_class($self->{$searchParam['relation'][0]}()->getRelated());
                $searchParams[$key]['values'] = $relationClass::lists($searchParam['relation'][1], 'id')->all();
                unset($searchParams[$key]['relation']);
            }
        }

        return json_encode(['url' => $url, 'params' => $searchParams]);
    }

}

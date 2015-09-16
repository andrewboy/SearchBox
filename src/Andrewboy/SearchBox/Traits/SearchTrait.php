<?php

namespace Andrewboy\SearchBox\Traits;

trait SearchTrait
{

    public function scopeSearch($query, array $params)
    {
        if (isset($params['search'])) {

            $this->extendSearch($query, $params['search']);

            foreach ($params['search'] as $key => $values) {

                if (false !== $key 
                        && in_array($key, array_keys(static::$_searchParams)) 
                        && self::isValidSearchParam($values)) {

                    switch (static::$_searchParams[$key]['type']) {

                        case 'integer':
                            $this->setIntegerSearchQuery($query, $key, $values);
                            break;

                        case 'date':
                            $this->setDateSearchQuery($query, $key, $values);
                            break;

                        case 'string':
                            $this->setStringSearchQuery($query, $key, $values);
                            break;

                        case 'boolean':
                            $this->setBooleanSearchQuery($query, $key, $values);
                            break;

                        case 'list':
                            $this->setListSearchQuery($query, $key, $values);
                            break;
                    }
                }
            }
        }
    }

    protected function extendSearch(&$query, array &$params)
    {
        //
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
                $query->whereHas(
                        static::$_searchParams[$key]['relation'][0], function($q) use($ids) {
                    $q->whereIn('id', $ids);
                }, '>', 0
                );
                break;

            case '!=':
                $ids = $values['values'];
                $query->whereHas(
                        static::$_searchParams[$key]['relation'][0], function($q) use($ids) {
                    $q->whereNotIn('id', $ids);
                }
                );
                break;
        }
    }

    public static function getSearchSet($url, array $extended = [])
    {
        $searchParams = $extended;

        foreach (static::$_searchParams as $key => $searchParam) {
            $searchParams[$key] = $searchParam;
            if ('list' === $searchParam['type']) {
                $self = new self;
                $relationClass = get_class(
                        $self->{$searchParam['relation'][0]}()
                                ->getRelated()
                );
                $searchParams[$key]['values'] = $relationClass::lists(
                                $searchParam['relation'][1], 'id'
                        )->all();
                unset($searchParams[$key]['relation']);
            }
        }

        /**
         * Todo: check existence on trans files 
         */
        return json_encode(
                [
                    'url' => $url,
                    'params' => $searchParams,
                    'operators' => trans('search-box::operators'),
                    'fieldLabels' => trans('search-box::field_names.' . __CLASS__)
                ]
        );
    }

    public static function isValidSearchParam($param)
    {
        return is_array($param) 
            && array_key_exists('operator', $param) 
            && array_key_exists('values', $param) 
            && is_array($param['values']) 
            && (array_key_exists('search', $param) && (bool)$param['search']);
    }

}

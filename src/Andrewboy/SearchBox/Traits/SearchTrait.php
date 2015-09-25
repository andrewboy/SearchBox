<?php namespace Andrewboy\SearchBox\Traits;

trait SearchTrait
{

    /**
     * The main search method
     * @param Builder $query Builder class from Laravel
     * @param array $params Search parameters
     */
    public function scopeSearch($query, array $params)
    {
        if (isset($params['search'])) {
            $this->extendSearch($query, $params['search']);

            foreach ($params['search'] as $key => $values) {
                if (false !== $key
                    && in_array($key, array_keys(static::$searchParams)) && self::isValidSearchParam($values)) {
                    switch (static::$searchParams[$key]['type']) {
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

    /**
     * Extend search with special process
     * @param Builder $query
     * @param array $params
     */
    protected function extendSearch(&$query, array &$params)
    {
        //
    }

    /**
     * Process INTEGER type of search
     * @param Builder $query
     * @param string $key
     * @param array $values
     */
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

    /**
     * Process DATE type of query
     * @param Builder $query
     * @param string $key
     * @param array $values
     */
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

    /**
     * Process STRING type of search
     * @param Builder $query
     * @param string $key
     * @param array $values
     */
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

    /**
     * Process BOOLEAN type of search
     * @param type $query
     * @param type $key
     * @param array $values
     */
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

    /**
     * Process LIST type of search
     * @param type $query
     * @param type $key
     * @param array $values
     */
    protected function setListSearchQuery($query, $key, array $values)
    {
        switch ($values['operator']) {
            case '=':
                $ids = $values['values'];
                $query->whereHas(
                    static::$searchParams[$key]['relation'][0],
                    function ($q) use ($ids) {
                        $q->whereIn('id', $ids);
                    },
                    '>',
                    0
                );
                break;

            case '!=':
                $ids = $values['values'];
                $query->whereHas(
                    static::$searchParams[$key]['relation'][0],
                    function ($q) use ($ids) {
                        $q->whereNotIn('id', $ids);
                    }
                );
                break;
        }
    }

    /**
     * Return the search set for the frontend javascript code
     * @param string $url
     * @param array $extended
     * @return array
     */
    public static function getSearchSet($url, array $extended = [])
    {
        $searchParams = $extended;

        foreach (static::$searchParams as $key => $searchParam) {
            $searchParams[$key] = $searchParam;
            if ('list' === $searchParam['type']) {
                $self = new self;
                $relationClass = get_class(
                    $self->{$searchParam['relation'][0]}()->getRelated()
                );
                $searchParams[$key]['values'] = $relationClass::lists($searchParam['relation'][1], 'id')->all();
                unset($searchParams[$key]['relation']);
            }
        }

        return json_encode(
            [
                'url' => $url,
                'params' => $searchParams,
                'operators' => trans('search-box::operators'),
                'fieldLabels' => trans('search-box::field_names.' . __CLASS__)
            ]
        );
    }

    /**
     * Validation helper for the extendSearch
     * @param array $param
     * @return boolean
     */
    public static function isValidSearchParam(array $param)
    {
        return is_array($param)
            && array_key_exists('operator', $param)
            && array_key_exists('values', $param)
            && is_array($param['values'])
            && (array_key_exists('search', $param)
            && (bool) $param['search']);
    }
}

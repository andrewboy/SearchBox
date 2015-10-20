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

            foreach ($params['search'] as $id => $values) {
                if (false !== $id
                    && in_array($id, array_keys(static::$searchParams)) && self::isValidSearchParam($values)) {
                    switch (static::$searchParams[$id]['type']) {
                        case 'integer':
                            $this->setIntegerSearchQuery($query, $id, $values);
                            break;

                        case 'date':
                            $this->setDateSearchQuery($query, $id, $values);
                            break;

                        case 'string':
                            $this->setStringSearchQuery($query, $id, $values);
                            break;

                        case 'boolean':
                            $this->setBooleanSearchQuery($query, $id, $values);
                            break;

                        case 'list':
                            $this->setListSearchQuery($query, $id, $values);
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
        $searchParams = [];

        #SET DEFAULT SETTINGS FROM THE MODEL
        foreach (static::$searchParams as $id => $searchParam) {
            $searchParams[$id] = $searchParam;
            if ('list' === $searchParam['type'] && array_key_exists('relation', $searchParam)
            && is_array($searchParam['relation'])) {
                $self = new self;
                $relationClass = get_class(
                    $self->{$searchParam['relation'][0]}()->getRelated()
                );
                $searchParams[$id]['values'] = $relationClass::lists($searchParam['relation'][1], 'id')->all();
                unset($searchParams[$id]['relation']);
            }
        }

        #SET EXTENDED SETTINGS
        if (count($extended) > 0) {
            foreach ($extended as $id => $searchItem) {
                if (array_key_exists($id, $searchParams)) {
                    if (array_key_exists('values', $searchItem) && is_array($searchItem['values'])) {
                        $searchParams[$id]['values'] = $searchItem['values'];
                    }
                } else {
                    if (array_key_exists('type', $searchItem)
                    && is_string($searchItem['type'])
                    && strlen($searchItem['type']) > 0) {
                        $validSearchItem = [];
                        $validSearchItem['type'] = $searchItem['type'];
                        
                        if (array_key_exists('values', $searchItem)) {
                            $validSearchItem['values'] = $searchItem['values'];
                        }
                        
                        $searchParams[$id] = $validSearchItem;
                    }
                }
            }
        }

        return json_encode(
            [
                'url' => $url,
                'params' => $searchParams,
                'operators' => trans('search-box::operators'),
                'fieldLabels' => is_array(trans('search-box::field_names.' . __CLASS__))
                    ? trans('search-box::field_names.' . __CLASS__) : []
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
            && (array_key_exists('active', $param)
            && (bool) $param['active']);
    }
}

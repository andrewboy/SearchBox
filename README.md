# SearchBox

This is a Laravel 5 package, that creates a searcbox for admin pages that uses Twitter Bootstrap. 

It's under development, not recommended for production use!

## Installation

add bundle to composer: 

```
"andrewboy/search-box": "dev-master"
```

run composer: 

```bash
composer install / update
```

add service provider to the providers list: 

```
'Andrewboy\SearchBox\SearchBoxServiceProvider'
```

publish config and migration: 

```bash
php artisan vendor:publish --provider="Andrewboy\SearchBox\SearchBoxServiceProvider"
```

add javascript plugin to the site

```bash
<script src="{{asset('vendor/search-box/js/jquery.searchBox.js')}}"></script>
```

or the minified version

```bash
<script src="{{asset('vendor/search-box/js/jquery.searchBox.min.js')}}"></script>
```

add plugin to your javascript file

```bash
$('.searchbox').searchBox();
```

add the trait to your models that you want to search

```bash
use \Andrewboy\SearchBox\Traits\SearchTrait;

class Banner extends Eloquent
{

    use SearchTrait;
```

in the model set the attributes like:

```bash
    protected static $searchParams = [
        'id' => [
            'type' => 'integer'
        ],
        'name' => [
            'type' => 'string'
        ],
        'url' => [
            'type' => 'string'
        ],
        'is_active' => [
            'type' => 'boolean'
        ],
        'has_attachment' => [
            'type' => 'boolean'
        ],
        'banner_place_id'    =>  [
            'type'  =>  'list',
            'relation'  =>  ['groups', 'name']
        ],
        'created_at' => [
            'type' => 'date'
        ],
    ];
```

in the model, extend the search for special cases

```bash
    protected function extendSearch(&$query, array &$params)
    {
        #BANNER_PLACE_ID
        if (isset($params['banner_place_id']) && self::isValidSearchParam($params['banner_place_id'])) {
            switch ($params['banner_place_id']['operator']) {
                case '=':
                    $query->whereIn('banner_place_id', $params['banner_place_id']['values']);
                    break;

                case '!=':
                    $query->whereNotIn('banner_place_id', $params['banner_place_id']['values']);
                    break;
            }

            unset($params['banner_place_id']);
        }

        #HAS_ATTACHMENT
        if (isset($params['has_attachment']) && self::isValidSearchParam($params['has_attachment'])) {
            switch ($params['has_attachment']['operator']) {
                case '=':
                    $query->has('attachment', 'LIKE', intval($params['has_attachment']['values'][0]));
                    break;

                case '!=':
                    $query->has('attachment', 'NOT LIKE', intval($params['has_attachment']['values'][0]));
                    break;
            }

            unset($params['has_attachment']);
        }
    }
```

in the controller, pass the search params:

```bash
$extended = []; //you don't have to use it, if it's empty

return View::make('banners.index', array('banners' => $banners))
    ->with(
        'searchParams', 
        Banner::getSearchSet(
            route("banners.index"),
            $extended
        )
    )
```

in the controller you can extend the previosly filled search settings:

```bash
$extended = [
    'banner_place_id'    =>  [
        'type'      =>  'list',
        'values'    =>  Banner::$bannerPlaces
    ]
];
```

in the controller, you can use it to search

```bash
$banners = Banner::search(Input::all());
```

the filter types:

```bash
integer
date
string
boolean
list
```

default language set is hu, en

you can extend the language in 'resources/lang/vendor/search-box'

to insert the view

```bash
@include('search-box::searchBox')
```

## Filters

### Integer

Operators: equals (=), not equals (!=), greater than or equal (>=), less than or equal (<=), (><),

### Date

Operators: equals (=), greater than or equal (>=), less than or equal (<=), not equal (><)

### String

Operators: contains (~), not contains (!~)

### Boolean

Operators: equals (=), not equals (!=)

### List

Operators: equals (=), not equals (!=)

write down how to publish the parts of the code etc.
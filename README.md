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


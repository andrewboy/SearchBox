<?php

namespace Andrewboy\SearchBox;

use Illuminate\Support\ServiceProvider;

class SearchBoxServiceProvider extends ServiceProvider {

	/**
	 * Indicates if loading of the provider is deferred.
	 *
	 * @var bool
	 */
	protected $defer = false;

	/**
	 * Register the service provider.
	 *
	 * @return void
	 */
	public function register()
	{
		//
	}

	/**
	 * Get the services provided by the provider.
	 *
	 * @return array
	 */
	public function provides()
	{
		return [];
	}

	public function boot()
	{
            #VIEW
            $this->loadViewsFrom(__DIR__.'/../../../resources/views/searchBox/', 'searchbox');
            
            #TRANSLATIONS
            $this->loadTranslationsFrom(__DIR__.'/../../../resources/lang/', 'searchbox');
            $this->publishes([
                __DIR__.'/../../../resources/lang/' => base_path('resources/lang/andrewboy/searchbox'),
            ]);
	}

}

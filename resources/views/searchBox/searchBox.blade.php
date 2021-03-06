<div class="box collapsed-box searchbox">

    <div class="box-header">
        <h3 class="box-title">{{trans('search-box::search_box.title')}}</h3>
        <div class="box-tools pull-right">
            <button data-original-title="Collapse" class="btn btn-default btn-sm" data-widget="collapse" data-toggle="tooltip" title="">
                <i class="fa fa-plus"></i>
            </button>
        </div>
    </div>

    <form action="" role="form">
        <div class="box-body">
            
        </div>
        <div class="box-footer">
            <div class="form-group col-md-1">
                <label for="searchbox-item-selector">{{trans('search-box::search_box.searchItemSelectorLabel')}}</label>
            </div>
            <div class="form-group col-md-2">
                <select name="searchbox-item-selector" class="form-control  input-block-level">
                    <option  disabled selected>{{trans('search-box::search_box.searchItemSelectorDefault')}}</option>
                </select>
            </div>
            <button class="btn btn-primary btn-flat" type="submit">{{trans('search-box::search_box.btnSearch')}}</button>
            <button class="btn btn-primary btn-flat searchbox-clear" type="button">{{trans('search-box::search_box.btnClear')}}</button>
        </div>
    </form>

    <script type="text/javascript">
        window.searchBoxParams = '{!! isset($searchParams) ? $searchParams : '' !!}';
    </script>
    
</div>
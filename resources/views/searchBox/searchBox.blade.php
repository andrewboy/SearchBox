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
        <input type="hidden" value="25" name="size">
        <input type="hidden" value="1" name="actual">
        <div style="display: none;" class="box-body">
            
        </div>
        <div style="display: none;" class="box-footer">
            <div class="form-group col-md-1">
                <label for="searchbox-item-selector">{{trans('search-box::search_box.searchItemSelectorLabel')}}</label>
            </div>
            <div class="form-group col-md-2">
                <select name="searchbox-item-selector" class="form-control  input-block-level">
                    <option  disabled selected>{{trans('search-box::search_box.searchItemSelectorDefault')}}</option>
                </select>
            </div>
            <button class="btn btn-primary btn-flat" type="submit">{{trans('search-box::search_box.btnSearch')}}</button>
            <button class="btn btn-primary btn-flat" type="submit">{{trans('search-box::search_box.btnClear')}}</button>
        </div>
    </form>

</div>
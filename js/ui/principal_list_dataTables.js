define(['jquery', 'datatables'], function($) {
    'use strict';
    /* Set the defaults for DataTables initialisation */
    $.extend(true, $.fn.dataTable.defaults, {
        dom: "<'row'<'col-xs-8 panel-search'f><'col-xs-4'lpi>r>t",
        pagingType: "bootstrap"
    });

    /* Default class modification */
    $.extend($.fn.dataTableExt.oStdClasses, {
        sWrapper: "dataTables_wrapper",
        sFilterInput: "form-control",
        sLengthSelect: "form-control",
        sFilter: '',
        sTable: 'dataTable table table-hover table-striped table-condensed'
    });

    /* API method to get paging information */
    $.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings)
    {
        return {
            iStart: oSettings._iDisplayStart,
            iEnd: oSettings.fnDisplayEnd(),
            iLength: oSettings._iDisplayLength,
            iTotal: oSettings.fnRecordsTotal(),
            iFilteredTotal: oSettings.fnRecordsDisplay(),
            iPage: oSettings._iDisplayLength === -1 ?
                    0 : Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
            iTotalPages: oSettings._iDisplayLength === -1 ?
                    0 : Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
        };
    };

    /* Bootstrap style pagination control */
    $.extend($.fn.dataTableExt.oPagination, {
        bootstrap: {
            fnInit: function(oSettings, nPaging, fnDraw) {
                var oLang = oSettings.oLanguage.oPaginate;
                var fnClickHandler = function(e) {
                    e.preventDefault();
                    if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
                        fnDraw(oSettings);
                    }
                };

                $(nPaging).append(
                        '<ul class="pager" style="margin: 2px">' +
                        '<li class="prev disabled"><a href="javascript:void(0)">' + oLang.sPrevious + '</a></li>' +
                        '<li class="next disabled"><a href="javascript:void(0)">' + oLang.sNext + '</a></li>' +
                        '</ul>'
                        );
                var els = $('a', nPaging);
                $(els[0]).bind('click.DT', {action: "previous"}, fnClickHandler);
                $(els[1]).bind('click.DT', {action: "next"}, fnClickHandler);
            },
            fnUpdate: function(oSettings, fnDraw) {
                var iListLength = 5;
                var oPaging = oSettings.oInstance.fnPagingInfo();
                var an = oSettings.aanFeatures.p;
                var i, ien, j, sClass, iStart, iEnd, iHalf = Math.floor(iListLength / 2);

                if (oPaging.iTotalPages < iListLength) {
                    iStart = 1;
                    iEnd = oPaging.iTotalPages;
                }
                else if (oPaging.iPage <= iHalf) {
                    iStart = 1;
                    iEnd = iListLength;
                } else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
                    iStart = oPaging.iTotalPages - iListLength + 1;
                    iEnd = oPaging.iTotalPages;
                } else {
                    iStart = oPaging.iPage - iHalf + 1;
                    iEnd = iStart + iListLength - 1;
                }

                for (i = 0, ien = an.length; i < ien; i++) {
                    // Remove the middle elements
                    $('li:gt(1)', an[i]).filter(':not(.next,.last)').remove();

                    // Add / remove disabled classes from the static elements
                    if (oPaging.iPage === 0)
                        $('li:eq(0)', an[i]).addClass('disabled');
                    else
                        $('li:eq(0)', an[i]).removeClass('disabled');

                    if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0)
                        $('li:eq(-1)', an[i]).addClass('disabled');
                    else
                        $('li:eq(-1)', an[i]).removeClass('disabled');
                }
            }
        }
    });

    /*
     * TableTools Bootstrap compatibility
     * Required TableTools 2.1+
     */
    if ($.fn.DataTable.TableTools) {
        // Set the classes that TableTools uses to something suitable for Bootstrap
        $.extend(true, $.fn.DataTable.TableTools.classes, {
            container: "DTTT btn-group",
            buttons: {
                normal: "btn btn-default",
                disabled: "disabled"
            },
            collection: {
                container: "DTTT_dropdown dropdown-menu",
                buttons: {
                    normal: "",
                    disabled: "disabled"
                }
            },
            print: {
                info: "DTTT_print_info modal"
            },
            select: {
                row: "active"
            }
        });

        // Have the collection use a bootstrap compatible dropdown
        $.extend(true, $.fn.DataTable.TableTools.DEFAULTS.oTags, {
            collection: {
                container: "ul",
                button: "li",
                liner: "a"
            }
        });
    }

    $.fn.dataTable.Api.register('fnFilterClear', function(oSettings)
    {
        /* Remove global filter */
        oSettings.oPreviousSearch.sSearch = "";

        /* Remove the text of the global filter in the input boxes */
        if (typeof oSettings.aanFeatures.f != 'undefined')
        {
            var n = oSettings.aanFeatures.f;
            for (var i = 0, iLen = n.length; i < iLen; i++)
            {
                $('input', n[i]).val('');
            }
        }

        /* Remove the search text for the column filters - NOTE - if you have input boxes for these
         * filters, these will need to be reset
         */
        for (var i = 0, iLen = oSettings.aoPreSearchCols.length; i < iLen; i++)
        {
            oSettings.aoPreSearchCols[i].sSearch = "";
            $('.dataTables_filter_column').eq(i).val('');
        }

        /* Redraw */
        oSettings.oApi._fnReDraw(oSettings);
    });

    $.fn.dataTableExt.oApi.fnSetFilteringPressEnter = function(oSettings) {
        /*
         * Type:        Plugin for DataTables (www.datatables.net) JQuery plugin.
         * Name:        dataTableExt.oApi.fnSetFilteringPressEnter
         * Version:     2.2.1
         * Description: Enables filtration to be triggered by pressing the enter key instead of keyup or delay.
         * Inputs:      object:oSettings - dataTables settings object
         *
         * Returns:     JQuery
         * Usage:       $('#example').dataTable().fnSetFilteringPressEnter();
         * Requires:   DataTables 1.6.0+
         *
         * Author:      Jon Ranes (www.mvccms.com)
         * Created:     4/17/2011
         * Language:    Javascript
         * License:     GPL v2 or BSD 3 point style
         * Contact:     jranes /AT\ mvccms.com
         */
        var _that = this;

        this.each(function(i) {
            $.fn.dataTableExt.iApiIndex = i;
            var anControl = $('input[type=search]', _that.fnSettings().aanFeatures.f);
            anControl.off().bind('keypress', function(e) {
                if (e.which == 13) {
                    $.fn.dataTableExt.iApiIndex = i;
                    _that.api(true).search(anControl.val());
                    _that.api(true).draw();
                }
            });
            return this;
        });
        return this;
    };
});
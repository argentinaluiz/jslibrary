define(['jquery', 'datatables'], function($) {
    'use strict';
    $.extend($.fn.dataTableExt.oStdClasses, {
        sProcessing: "alert alert-info dataTables_processing"
    });

    /* API method to get paging information */
    $.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings)
    {
        return {
            "iStart": oSettings._iDisplayStart,
            "iEnd": oSettings.fnDisplayEnd(),
            "iLength": oSettings._iDisplayLength,
            "iTotal": oSettings.fnRecordsTotal(),
            "iFilteredTotal": oSettings.fnRecordsDisplay(),
            "iPage": oSettings._iDisplayLength === -1 ?
                    0 : Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
            "iTotalPages": oSettings._iDisplayLength === -1 ?
                    0 : Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
        };
    };


    /* Bootstrap style pagination control */
    $.extend($.fn.dataTableExt.oPagination, {
        "bootstrap": {
            "fnInit": function(oSettings, nPaging, fnDraw) {
                var oLang = oSettings.oLanguage.oPaginate,
                        fnClickHandler = function(e) {
                            e.preventDefault();
                            if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
                                fnDraw(oSettings);
                            }
                        }, els;

                $(nPaging).addClass('pagination').append(
                        '<ul>' +
                        '<li class="first disabled"><a href="#">' + oLang.sFirst + '</a></li>' +
                        '<li class="prev disabled"><a href="#">' + oLang.sPrevious + '</a></li>' +
                        '<li class="next disabled"><a href="#">' + oLang.sNext + '</a></li>' +
                        '<li class="last disabled"><a href="#">' + oLang.sLast + '</a></li>' +
                        '</ul>'
                        );
                els = $('a', nPaging);
                $(els[0]).bind('click.DT', {action: "first"}, fnClickHandler);
                $(els[1]).bind('click.DT', {action: "previous"}, fnClickHandler);
                $(els[2]).bind('click.DT', {action: "next"}, fnClickHandler);
                $(els[3]).bind('click.DT', {action: "last"}, fnClickHandler);
            },
            "fnUpdate": function(oSettings, fnDraw) {
                var iListLength = 5,
                        oPaging = oSettings.oInstance.fnPagingInfo(),
                        an = oSettings.aanFeatures.p,
                        i,
                        ien,
                        j,
                        sClass,
                        iStart,
                        iEnd,
                        iHalf;
                iHalf = Math.floor(iListLength / 2);

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

                    // Add the new list items and their event handlers
                    for (j = iStart; j <= iEnd; j++) {
                        sClass = (j == oPaging.iPage + 1) ? 'class="active"' : '';
                        $('<li ' + sClass + '><a href="#">' + j + '</a></li>')
                                .insertBefore($('li.next', an[i])[0])
                                .bind('click', function(e) {
                                    e.preventDefault();
                                    oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
                                    fnDraw(oSettings);
                                });
                    }

                    // Add / remove disabled classes from the static elements
                    if (oPaging.iPage === 0) {
                        $('li:eq(0)', an[i]).addClass('disabled');
                        $('li:eq(1)', an[i]).addClass('disabled');
                    } else {
                        $('li:eq(0)', an[i]).removeClass('disabled');
                        $('li:eq(1)', an[i]).removeClass('disabled');
                    }

                    if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
                        $('li:eq(-1)', an[i]).addClass('disabled');
                        $('li:eq(-2)', an[i]).addClass('disabled');
                    } else {
                        $('li:eq(-1)', an[i]).removeClass('disabled');
                        $('li:eq(-2)', an[i]).removeClass('disabled');
                    }
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
            "container": "DTTT btn-group",
            "buttons": {
                "normal": "btn",
                "disabled": "disabled"
            },
            "collection": {
                "container": "DTTT_dropdown dropdown-menu",
                "buttons": {
                    "normal": "",
                    "disabled": "disabled"
                }
            },
            "print": {
                "info": "DTTT_print_info modal"
            },
            "select": {
                "row": "active"
            }
        });

        // Have the collection use a bootstrap compatible dropdown
        $.extend(true, $.fn.DataTable.TableTools.DEFAULTS.oTags, {
            "collection": {
                "container": "ul",
                "button": "li",
                "liner": "a"
            }
        });
    }
    /* Default class modification */
    $.extend($.fn.dataTableExt.oStdClasses, {
        "sWrapper": "dataTables_wrapper form-inline",
        "sStripeOdd": "alert alert-info",
        "sStripeEven": "even"
    });
});
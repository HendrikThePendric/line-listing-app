import arrayContains from 'd2-utilizr/lib/arrayContains';
import clone from 'd2-utilizr/lib/clone';
import isArray from 'd2-utilizr/lib/isArray';
import isString from 'd2-utilizr/lib/isString';

export var QueryLayoutWindow;

QueryLayoutWindow = function(c) {
    var t = this,

        uiManager = c.uiManager,
        instanceManager = c.instanceManager,
        i18n = c.i18nManager.get(),
        dimensionConfig = c.dimensionConfig,

        confData = dimensionConfig.get('data'),
        confPeriod = dimensionConfig.get('period'),
        confOrganisationUnit = dimensionConfig.get('organisationUnit'),
        confCategory = dimensionConfig.get('category'),

        dimensionStoreMap = {},
        margin = 1,
        defaultWidth = 200,
        defaultHeight = 220;

    // components

    var dimension,
        dimensionStore,
        col,
        colStore,

        getStore,
        getStoreKeys,
        getCmpHeight,
        getSetup,
        addDimension,
        removeDimension,
        hasDimension,
        saveState,
        resetData,
        reset,
        dimensionStoreMap = {},

        dimensionPanel,
        window,

        margin = 1,
        defaultWidth = 210,
        defaultHeight = 158,
        maxHeight = (ns.app.viewport.getHeight() - 100) / 2,

        dataType = dimensionConfig.dataType['individual_cases'];

    getStore = function(data) {
        var config = {};

        config.fields = ['id', 'name'];

        if (data) {
            config.data = data;
        }

        config.getDimensionNames = function() {
            var dimensionNames = [];

            this.each(function(r) {
                dimensionNames.push(r.data.id);
            });

            return Ext.clone(dimensionNames);
        };

        return Ext.create('Ext.data.Store', config);
    };

    getStoreKeys = function(store) {
        var keys = [],
            items = store.data.items;

        if (items) {
            for (var i = 0; i < items.length; i++) {
                keys.push(items[i].data.id);
            }
        }

        return keys;
    };

    dimensionStore = getStore();
    dimensionStore.reset = function(all) {
        dimensionStore.removeAll();
    };

    colStore = getStore();

    getCmpHeight = function() {
        var size = dimensionStore.totalCount,
            expansion = 10,
            height = defaultHeight,
            diff;

        if (size > 10) {
            diff = size - 10;
            height += (diff * expansion);
        }

        height = height > maxHeight ? maxHeight : height;

        return height;
    };

    dimension = Ext.create('Ext.ux.form.MultiSelect', {
        cls: 'ns-toolbar-multiselect-leftright',
        width: defaultWidth - 50,
        height: (getCmpHeight() * 2) + margin,
        style: 'margin-right:' + margin + 'px; margin-bottom:0px',
        valueField: 'id',
        displayField: 'name',
        dragGroup: 'querylayoutDD',
        dropGroup: 'querylayoutDD',
        ddReorder: false,
        store: dimensionStore,
        tbar: {
            height: 25,
            items: {
                xtype: 'label',
                text: i18n.excluded_dimensions,
                cls: 'ns-toolbar-multiselect-leftright-label'
            }
        },
        listeners: {
            afterrender: function(ms) {
                ms.boundList.on('itemdblclick', function(view, record) {
                    ms.store.remove(record);
                    colStore.add(record);
                });

                ms.store.on('add', function() {
                    Ext.defer( function() {
                        ms.boundList.getSelectionModel().deselectAll();
                    }, 10);
                });
            }
        }
    });

    col = Ext.create('Ext.ux.form.MultiSelect', {
        cls: 'ns-toolbar-multiselect-leftright',
        width: defaultWidth,
        height: (getCmpHeight() * 2) + margin,
        style: 'margin-bottom: 0px',
        valueField: 'id',
        displayField: 'name',
        dragGroup: 'querylayoutDD',
        dropGroup: 'querylayoutDD',
        store: colStore,
        tbar: {
            height: 25,
            items: {
                xtype: 'label',
                text: i18n.column_dimensions,
                cls: 'ns-toolbar-multiselect-leftright-label'
            }
        },
        listeners: {
            afterrender: function(ms) {
                ms.boundList.on('itemdblclick', function(view, record) {
                    ms.store.remove(record);
                    dimensionStore.add(record);
                });

                ms.store.on('add', function() {
                    Ext.defer( function() {
                        ms.boundList.getSelectionModel().deselectAll();
                    }, 10);
                });
            }
        }
    });

    getSetup = function() {
        return {
            col: getStoreKeys(colStore)
        };
    };

    addDimension = function(record, store) {
        var store = dimensionStoreMap[record.id] || store || dimensionStore;

        if (!hasDimension(record.id)) {
            store.add(record);
        }
    };

    removeDimension = function(dataElementId) {
        var stores = [dimensionStore, colStore];

        for (var i = 0, store, index; i < stores.length; i++) {
            store = stores[i];
            index = store.findExact('id', dataElementId);

            if (index != -1) {
                store.remove(store.getAt(index));
                dimensionStoreMap[dataElementId] = store;
            }
        }
    };

    hasDimension = function(id) {
        var stores = [colStore, dimensionStore];

        for (var i = 0, store, index; i < stores.length; i++) {
            store = stores[i];
            index = store.findExact('id', id);

            if (index != -1) {
                return true;
            }
        }

        return false;
    };

    saveState = function(map) {
        map = map || dimensionStoreMap;

        dimensionStore.each(function(record) {
            map[record.data.id] = dimensionStore;
        });

        colStore.each(function(record) {
            map[record.data.id] = colStore;
        });

        return map;
    };

    resetData = function() {
        var map = saveState({}),
            keys = ['pe', 'latitude', 'longitude', 'ou'];

        for (var key in map) {
            if (map.hasOwnProperty(key) && !Ext.Array.contains(keys, key)) {
                removeDimension(key);
            }
        }
    };

    reset = function() {
        colStore.removeAll();
        dimensionStore.removeAll();

        colStore.add({id: 'pe', name: 'Event date'});
        colStore.add({id: 'ou', name: 'Organisation unit'});

        dimensionStore.add({id: 'longitude', name: 'Longitude'});
        dimensionStore.add({id: 'latitude', name: 'Latitude'});
    };

    window = Ext.create('Ext.window.Window', {
        title: i18n.table_layout,
        layout: 'column',
        bodyStyle: 'background-color:#fff; padding:' + margin + 'px',
        closeAction: 'hide',
        autoShow: true,
        modal: true,
        resizable: false,
        getSetup: getSetup,
        dimensionStore: dimensionStore,
        dataType: dataType,
        colStore: colStore,
        addDimension: addDimension,
        removeDimension: removeDimension,
        hasDimension: hasDimension,
        saveState: saveState,
        resetData: resetData,
        reset: reset,
        getValueConfig: function() {
            return {};
        },
        hideOnBlur: true,
        items: [
            dimension,
            col
        ],
        bbar: [
            '->',
            {
                text: i18n.hide,
                listeners: {
                    added: function(b) {
                        b.on('click', function() {
                            window.hide();
                        });
                    }
                }
            },
            {
                text: '<b>' + i18n.update + '</b>',
                listeners: {
                    added: function(b) {
                        b.on('click', function() {
                            var config = ns.core.web.report.getLayoutConfig();

                            if (!config) {
                                return;
                            }

                            // keep sorting
                            if (ns.app.layout && ns.app.layout.sorting) {
                                config.sorting = Ext.clone(ns.app.layout.sorting);
                            }

                            window.hide();

                            ns.core.web.report.getData(config, false);
                        });
                    }
                }
            }
        ],
        listeners: {
            show: function(w) {
                if (ns.app.layoutButton.rendered) {
                    ns.core.web.window.setAnchorPosition(w, ns.app.layoutButton);

                    if (!w.hasHideOnBlurHandler) {
                        ns.core.web.window.addHideOnBlurHandler(w);
                    }
                }
            },
            render: function() {
                reset();
            }
        }
    });

    return window;
};

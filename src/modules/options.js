import pick from 'lodash-es/pick'

export const OPTION_LEGEND_DISPLAY_STRATEGY = 'legendDisplayStrategy'
export const OPTION_LEGEND_DISPLAY_STYLE = 'legendDisplayStyle'
export const OPTION_LEGEND_SET = 'legendSet'
export const OPTION_SHOW_LEGEND_KEY = 'showLegendKey'

export const options = {
    /*
    TODO: PIVOT TABLE OPTIONS:
    showHierarchy: { defaultValue: false, requestable: true, savable: true },
    showDimensionLabels: {
        defaultValue: false,
        requestable: false,
        savable: true,
    },
    colTotals: { defaultValue: false, requestable: false, savable: true },
    colSubTotals: { defaultValue: false, requestable: false, savable: true },
    rowTotals: { defaultValue: false, requestable: false, savable: true },
    rowSubTotals: { defaultValue: false, requestable: false, savable: true },
    // FIXME: hideEmptyRowItems or hideEmptyRows ??
    hideEmptyRowItems: {
        defaultValue: 'NONE',
        requestable: false,
        savable: true,
    },
    hideEmptyRows: { defaultValue: false, requestable: false, savable: true },
    // TODO: Hide n/a data
    legend: {
        defaultValue: {},
        requestable: false,
        savable: true,
    },
    title: { defaultValue: undefined, requestable: false, savable: true },*/
    completedOnly: { defaultValue: false, requestable: true, savable: true },
    displayDensity: {
        defaultValue: 'NORMAL',
        requestable: false,
        savable: true,
    },
    fontSize: { defaultValue: 'NORMAL', requestable: false, savable: true },
    digitGroupSeparator: {
        defaultValue: 'SPACE',
        requestable: false,
        savable: true,
    },
    // TODO: Limit the number of rows shown in the table
    // TODO: Only show the [top/bottom] x rows
}

export default options

export const getOptionsForUi = () => {
    return Object.entries({ ...options }).reduce((map, [option, props]) => {
        map[option] = props.defaultValue
        return map
    }, {})
}

export const getOptionsFromVisualization = visualization => {
    const optionsFromVisualization = {
        ...getOptionsForUi(),
        ...pick(visualization, Object.keys(options)),
    }

    return optionsFromVisualization
}

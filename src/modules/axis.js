import {
    AXIS_ID_COLUMNS,
    AXIS_ID_FILTERS,
    AXIS_ID_ROWS,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'

const getAxisNames = () => ({
    [AXIS_ID_COLUMNS]: i18n.t('Columns'),
    [AXIS_ID_ROWS]: i18n.t('Rows'),
    [AXIS_ID_FILTERS]: i18n.t('Filter'),
})

export const getAxisName = (axisId) => {
    const name = getAxisNames()[axisId]
    if (!name) {
        throw new Error(`${axisId} is not a valid axis id`)
    }

    return name
}

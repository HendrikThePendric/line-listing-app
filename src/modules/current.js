import { dimensionCreate, VIS_TYPE_LINE_LIST } from '@dhis2/analytics'
import pick from 'lodash-es/pick'
import { BASE_FIELD_TYPE } from './fields.js'
import { getAdaptedUiLayoutByType } from './layout.js'
import { options } from './options.js'
import { parseUiRepetition } from './ui.js'

export const getDefaultFromUi = (current, action) => {
    const ui = {
        ...action.value,
        layout: {
            ...getAdaptedUiLayoutByType(
                action.value.layout,
                VIS_TYPE_LINE_LIST
            ),
        },
        itemsByDimension: getItemsByDimensionFromUi(action.value),
    }

    return {
        ...current,
        [BASE_FIELD_TYPE]: ui.type,
        outputType: ui.input.type,
        ...getProgramFromUi(ui),
        ...getProgramStageFromUi(ui),
        ...getAxesFromUi(ui),
        ...getOptionsFromUi(ui),
    }
}

export const getProgramFromUi = (ui) =>
    ui.program?.id && { program: { id: ui.program.id } }

export const getProgramStageFromUi = (ui) =>
    ui.program?.stageId && { programStage: { id: ui.program.stageId } }

export const getOptionsFromUi = (ui) => pick(ui.options, Object.keys(options))

export const getAxesFromUi = (ui) =>
    Object.entries(ui.layout).reduce(
        (layout, [axisId, dimensionIds]) => ({
            ...layout,
            [axisId]: dimensionIds
                .map((dimensionId) =>
                    dimensionCreate(
                        dimensionId,
                        ui.itemsByDimension[dimensionId],
                        {
                            filter: ui.conditions[dimensionId]?.condition,
                            ...(ui.conditions[dimensionId]?.legendSet && {
                                legendSet: {
                                    id: ui.conditions[dimensionId].legendSet,
                                },
                            }),
                            ...(ui.repetitionByDimension &&
                                ui.repetitionByDimension[dimensionId] && {
                                    repetition: {
                                        indexes: parseUiRepetition(
                                            ui.repetitionByDimension[
                                                dimensionId
                                            ]
                                        ),
                                    },
                                }),
                        }
                    )
                )
                .filter((dim) => dim !== null),
        }),
        {}
    )

export const getItemsByDimensionFromUi = (ui) => {
    const result = {}
    Object.keys(ui.itemsByDimension).forEach(
        (key) => (result[key] = ui.itemsByDimension[key])
    )
    return result
}

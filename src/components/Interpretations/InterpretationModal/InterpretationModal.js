import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalActions,
    ModalContent,
    NoticeBox,
    Button,
    spacers,
    colors,
    Layer,
    CenteredContent,
    CircularLoader,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import css from 'styled-jsx/css'
import { Visualization } from '../../Visualization/Visualization.js'
import { InterpretationThread } from './InterpretationThread.js'
import { useModalContentWidth } from './useModalContentWidth.js'

const modalCSS = css.resolve`
    aside {
        min-width: 600px;
        min-height: 600px;
        max-width: 90vw !important;
        max-height: 90vh !important;
        width: auto !important;
        height: auto !important;
    }
    aside.hidden {
        display: none;
    }
`

function getModalContentCSS(width) {
    return css.resolve`
        div {
            width: ${width}px;
        }
    `
}

const query = {
    interpretation: {
        resource: 'interpretations',
        id: ({ id }) => id,
        params: {
            fields: [
                'access',
                'id',
                'text',
                'created',
                'user[id,displayName]',
                'likes',
                'likedBy',
                'comments[access,id,text,created,createdBy[id,displayName]]',
            ],
        },
    },
}

const InterpretationModal = ({
    currentUser,
    isVisualizationLoading,
    visualization,
    onResponseReceived,
    downloadMenuComponent,
    onClose,
    onInterpretationUpdate,
    interpretationId,
    initialFocus,
}) => {
    const modalContentWidth = useModalContentWidth()
    const modalContentCSS = getModalContentCSS(modalContentWidth)
    const [isDirty, setIsDirty] = useState(false)
    const { data, error, loading, fetching, refetch } = useDataQuery(query, {
        lazy: true,
    })
    const interpretation = data?.interpretation
    const shouldRenderModalContent = !error && interpretation
    const shouldCssHideModal = loading || isVisualizationLoading
    const handleClose = () => {
        if (isDirty) {
            onInterpretationUpdate()
            setIsDirty(false)
        }
        onClose()
    }
    const onThreadUpdated = (affectsInterpretation) => {
        if (affectsInterpretation) {
            setIsDirty(true)
        }
        refetch({ id: interpretationId })
    }
    const onInterpretationDeleted = () => {
        setIsDirty(false)
        onInterpretationUpdate()
        onClose()
    }

    useEffect(() => {
        if (interpretationId) {
            refetch({ id: interpretationId })
        }
    }, [interpretationId])

    return (
        <>
            {shouldCssHideModal && (
                <Layer>
                    <CenteredContent>
                        <CircularLoader />
                    </CenteredContent>
                </Layer>
            )}
            <Modal
                onClose={handleClose}
                className={cx(modalCSS.className, {
                    hidden: shouldCssHideModal,
                })}
            >
                <h1 className="title">
                    <span className="ellipsis">
                        {i18n.t(
                            'Viewing interpretation: {{visualisationName}}',
                            {
                                visualisationName: visualization.displayName,
                                nsSeparator: '^^',
                            }
                        )}
                    </span>
                </h1>
                <ModalContent className={modalContentCSS.className}>
                    <div className="container">
                        {error && (
                            <NoticeBox
                                error
                                title={i18n.t('Could not load interpretation')}
                            >
                                {error.message ||
                                    i18n.t(
                                        'The interpretation couldn’t be displayed. Try again or contact your system administrator.'
                                    )}
                            </NoticeBox>
                        )}
                        {shouldRenderModalContent && (
                            <div className="row">
                                <div className="visualisation-wrap">
                                    <Visualization
                                        relativePeriodDate={
                                            interpretation.created
                                        }
                                        visualization={visualization}
                                        onResponseReceived={onResponseReceived}
                                    />
                                </div>
                                <div className="thread-wrap">
                                    <InterpretationThread
                                        currentUser={currentUser}
                                        fetching={fetching}
                                        interpretation={interpretation}
                                        onInterpretationDeleted={
                                            onInterpretationDeleted
                                        }
                                        onThreadUpdated={onThreadUpdated}
                                        initialFocus={initialFocus}
                                        downloadMenuComponent={
                                            downloadMenuComponent
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </ModalContent>
                <ModalActions>
                    <Button disabled={fetching} onClick={handleClose}>
                        {i18n.t('Hide interpretation')}
                    </Button>
                </ModalActions>
                {modalCSS.styles}
                {modalContentCSS.styles}
                <style jsx>{`
                    .title {
                        color: ${colors.grey900};
                        margin: 0px;
                        padding: ${spacers.dp24} ${spacers.dp24} ${spacers.dp4};
                    }

                    .ellipsis {
                        display: inline-block;
                        font-size: 20px;
                        font-weight: 500;
                        line-height: 24px;
                        white-space: nowrap;
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .container {
                        display: flex;
                        flex-direction: column;
                    }

                    .row {
                        display: flex;
                        flex-direction: row;
                        gap: 16px;
                    }

                    .visualisation-wrap {
                        flex-grow: 1;
                    }

                    .thread-wrap {
                        flex-basis: 300px;
                        flex-shrink: 0;
                        overflow-y: auto;
                    }
                `}</style>
            </Modal>
        </>
    )
}

InterpretationModal.propTypes = {
    currentUser: PropTypes.object.isRequired,
    downloadMenuComponent: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]).isRequired,
    interpretationId: PropTypes.string.isRequired,
    isVisualizationLoading: PropTypes.bool.isRequired,
    visualization: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onResponseReceived: PropTypes.func.isRequired,
    initialFocus: PropTypes.bool,
    onInterpretationUpdate: PropTypes.func,
}

export { InterpretationModal }

import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalActions,
    ModalContent,
    Button,
    spacers,
    colors,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import css from 'styled-jsx/css'
import { InterpretationModalContent } from './InterpretationModalContent.js'

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

const query = {
    interpretation: {
        resource: 'interpretations',
        id: ({ id }) => id,
        params: {
            fields: [
                'id',
                'text',
                'created',
                'createdBy[id,displayName]',
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
    onClose,
    interpretationId,
}) => {
    const { data, error, loading, fetching, refetch } = useDataQuery(query, {
        lazy: true,
    })
    const shouldCssHideModal = loading || isVisualizationLoading

    useEffect(() => {
        refetch({ id: interpretationId })
    }, [interpretationId])

    if (!interpretationId) {
        return null
    }

    return (
        <Modal
            position="middle"
            onClose={onClose}
            className={cx(modalCSS.className, {
                hidden: shouldCssHideModal,
            })}
        >
            <h1 className="title">
                <span className="ellipsis">
                    {i18n.t('Viewing interpretation: {{visualisationName}}', {
                        visualisationName: visualization.displayName,
                        nsSeparator: '^^',
                    })}
                </span>
            </h1>
            <ModalContent className="modalContent">
                <div className="container">
                    <InterpretationModalContent
                        error={error}
                        fetching={fetching}
                        interpretation={data?.interpretation}
                        onResponseReceived={onResponseReceived}
                        refetchInterpretation={refetch}
                        visualization={visualization}
                        currentUser={currentUser}
                    />
                </div>
            </ModalContent>
            <ModalActions>
                <Button disabled={fetching} onClick={onClose}>
                    {i18n.t('Hide interpretation')}
                </Button>
            </ModalActions>
            {modalCSS.styles}
            <style jsx>{`
                .title {
                    color: ${colors.grey900};
                    font-size: 20px;
                    font-weight: 500;
                    line-height: 24px;
                    margin: 0px;
                    padding: ${spacers.dp24} ${spacers.dp24} 0;
                }

                .ellipsis {
                    display: inline-block;
                    line-height: 20px;
                    white-space: nowrap;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .container {
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
        </Modal>
    )
}

InterpretationModal.propTypes = {
    currentUser: PropTypes.object.isRequired,
    isVisualizationLoading: PropTypes.bool.isRequired,
    visualization: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onResponseReceived: PropTypes.func.isRequired,
    interpretationId: PropTypes.string,
}

export { InterpretationModal }

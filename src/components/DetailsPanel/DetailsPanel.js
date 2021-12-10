import { AboutAOUnit } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import React from 'react'
import { connect } from 'react-redux'
import history from '../../modules/history.js'
import { sGetCurrent } from '../../reducers/current.js'
import { sGetUser } from '../../reducers/user.js'
import { InterpretationsUnit } from '../Interpretations/InterpretationsUnit/index.js'
import classes from './styles/DetailsPanel.module.css'

const navigateToOpenModal = (interpretationId, initialFocus) => {
    history.push(
        {
            pathName: history.location.pathname,
            search: `?${stringify({ interpretationId, initialFocus })}`,
        },
        { isModalOpening: true }
    )
}

export const DetailsPanel = ({
    currentUser,
    interpretationsUnitRef,
    visualization,
}) => (
    <div className={classes.panel}>
        <AboutAOUnit type="eventReports" id={visualization.id} />
        <InterpretationsUnit
            ref={interpretationsUnitRef}
            type="eventReport"
            id={visualization.id}
            currentUser={currentUser}
            onInterpretationClick={(interpretationId) =>
                navigateToOpenModal(interpretationId)
            }
            onReplyIconClick={(interpretationId) =>
                navigateToOpenModal(interpretationId, true)
            }
        />
    </div>
)

DetailsPanel.propTypes = {
    currentUser: PropTypes.object.isRequired,
    interpretationsUnitRef: PropTypes.object.isRequired,
    visualization: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    currentUser: sGetUser(state),
    visualization: sGetCurrent(state),
})

export default connect(mapStateToProps)(DetailsPanel)

import { IconArrowRight16, IconFolder16 } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acSetUiMainSideBarExpanded } from '../../actions/ui.js'
import { sGetUiLeftSidebarExpanded } from '../../reducers/ui.js'
import { DimensionMenuItem } from './DimensionMenuItem.js'
import styles from './DimensionPanel.module.css'

const DimensionPanel = () => {
    const dispatch = useDispatch()
    const open = useSelector(sGetUiLeftSidebarExpanded)
    const toggle = () => dispatch(acSetUiMainSideBarExpanded(!open))
    const onClick = () => console.log('clicked')

    return (
        <div className={styles.container}>
            <div className={styles.main} onClick={toggle}>
                <DimensionMenuItem
                    icon={<IconArrowRight16 />}
                    label="Input: Person"
                    onClick={onClick}
                />
                <DimensionMenuItem
                    icon={<IconFolder16 />}
                    label="Program dimensions"
                    onClick={onClick}
                    selected
                />
                <DimensionMenuItem
                    icon={<IconFolder16 />}
                    label="Your dimensions"
                    onClick={onClick}
                    count={5}
                />
            </div>
            <div className={cx(styles.accessory, { [styles.hidden]: !open })}>
                <div className={styles.accessoryInner}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                </div>
            </div>
        </div>
    )
}

export { DimensionPanel }

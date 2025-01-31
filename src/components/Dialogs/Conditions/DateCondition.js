import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption, Button, Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { NULL_VALUE, DATE_OPERATORS } from '../../../modules/conditions.js'
import classes from './styles/Condition.module.css'

const TYPE_DATE = 'date'
const TYPE_DATETIME = 'datetime-local'
const TYPE_TIME = 'time'

const API_TIME_DIVIDER = '.' // TODO: Currently just picked a random character, use the correct character preferred by backend
const UI_TIME_DIVIDER = ':'

const BaseCondition = ({ condition, onChange, onRemove, type }) => {
    let operator, value

    if (condition.includes(NULL_VALUE)) {
        operator = condition
    } else {
        const parts = condition.split(':')
        operator = parts[0]
        value = parts[1]
    }

    const setOperator = (input) => {
        if (input.includes(NULL_VALUE)) {
            onChange(`${input}`)
        } else {
            onChange(`${input}:${value || ''}`)
        }
    }

    const setValue = (input) => {
        onChange(
            `${operator}:${
                input.replaceAll(UI_TIME_DIVIDER, API_TIME_DIVIDER) || ''
            }`
        )
    }

    return (
        <div className={classes.container}>
            <SingleSelectField
                selected={operator}
                placeholder={i18n.t('Choose a condition type')}
                dense
                onChange={({ selected }) => setOperator(selected)}
                className={classes.operatorSelect}
            >
                {Object.entries(DATE_OPERATORS).map(([key, value]) => (
                    <SingleSelectOption key={key} value={key} label={value} />
                ))}
            </SingleSelectField>
            {operator && !operator.includes(NULL_VALUE) && (
                <Input
                    value={value.replaceAll(API_TIME_DIVIDER, UI_TIME_DIVIDER)}
                    type={type}
                    onChange={({ value }) => setValue(value)}
                    className={classes.dateInput}
                    dense
                />
            )}
            <Button
                type="button"
                small
                secondary
                onClick={onRemove}
                className={classes.removeButton}
            >
                {i18n.t('Remove')}
            </Button>
        </div>
    )
}

BaseCondition.propTypes = {
    condition: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
}

export const DateCondition = (props) => (
    <BaseCondition type={TYPE_DATE} {...props} />
)

export const DateTimeCondition = (props) => (
    <BaseCondition type={TYPE_DATETIME} {...props} />
)

export const TimeCondition = (props) => (
    <BaseCondition type={TYPE_TIME} {...props} />
)

import {
    getDefaultUiRepetition,
    getDefaultCurrentRepetition,
    parseCurrentRepetition,
    parseUiRepetition,
    PARSE_CURRENT_REPETITION_ERROR,
    PROP_OLDEST,
    PROP_MOST_RECENT,
    PARSE_UI_REPETITION_ERROR,
} from '../ui.js'

describe('parseCurrentRepetition', () => {
    const defaultUiRepetition = getDefaultUiRepetition()
    const defaultCurrentRepetition = getDefaultCurrentRepetition()

    it('does not modify the input', () => {
        parseCurrentRepetition(defaultCurrentRepetition)

        expect(defaultCurrentRepetition).toEqual(getDefaultCurrentRepetition())
    })

    it('converts from current to ui format', () => {
        expect(() => parseCurrentRepetition()).toThrow(
            PARSE_CURRENT_REPETITION_ERROR
        )

        expect(() => parseCurrentRepetition([])).toThrow(
            PARSE_CURRENT_REPETITION_ERROR
        )

        expect(() => parseCurrentRepetition([1, 2, null])).toThrow(
            PARSE_CURRENT_REPETITION_ERROR
        )

        expect(parseCurrentRepetition(defaultCurrentRepetition)).toEqual(
            defaultUiRepetition
        )

        expect(parseCurrentRepetition([1])).toEqual({
            [PROP_MOST_RECENT]: 0,
            [PROP_OLDEST]: 1,
        })

        expect(parseCurrentRepetition([0, 1])).toEqual({
            [PROP_MOST_RECENT]: 1,
            [PROP_OLDEST]: 1,
        })

        expect(parseCurrentRepetition([0, -1])).toEqual({
            [PROP_MOST_RECENT]: 2,
            [PROP_OLDEST]: 0,
        })

        expect(parseCurrentRepetition([-1, 0, 1])).toEqual({
            [PROP_MOST_RECENT]: 2,
            [PROP_OLDEST]: 1,
        })

        expect(parseCurrentRepetition([0, 1, 2])).toEqual({
            [PROP_MOST_RECENT]: 1,
            [PROP_OLDEST]: 2,
        })

        expect(parseCurrentRepetition([1, 2, -1, 0])).toEqual({
            [PROP_MOST_RECENT]: 2,
            [PROP_OLDEST]: 2,
        })
    })
})

describe('parseUiRepetition', () => {
    const defaultUiRepetition = getDefaultUiRepetition()
    const defaultCurrentRepetition = getDefaultCurrentRepetition()

    it('does not modify the input', () => {
        parseUiRepetition(defaultUiRepetition)

        expect(defaultUiRepetition).toEqual(getDefaultUiRepetition())
    })

    it('converts from ui to current format', () => {
        expect(() => parseUiRepetition()).toThrow(PARSE_UI_REPETITION_ERROR)

        expect(() => parseUiRepetition({})).toThrow(PARSE_UI_REPETITION_ERROR)

        expect(() =>
            parseUiRepetition({
                [PROP_MOST_RECENT]: -1,
                [PROP_OLDEST]: 1,
            })
        ).toThrow(PARSE_UI_REPETITION_ERROR)

        expect(() =>
            parseUiRepetition({
                [PROP_MOST_RECENT]: 1,
                [PROP_OLDEST]: true,
            })
        ).toThrow(PARSE_UI_REPETITION_ERROR)

        // invalid, but allowed in dialog
        expect(
            parseUiRepetition({
                [PROP_MOST_RECENT]: 0,
                [PROP_OLDEST]: 0,
            })
        ).toEqual(defaultCurrentRepetition)

        // default
        expect(parseUiRepetition(defaultUiRepetition)).toEqual(
            defaultCurrentRepetition
        )

        expect(
            parseUiRepetition({
                [PROP_MOST_RECENT]: 0,
                [PROP_OLDEST]: 1,
            })
        ).toEqual([1])

        expect(
            parseUiRepetition({
                [PROP_MOST_RECENT]: 1,
                [PROP_OLDEST]: 1,
            })
        ).toEqual([1, 0])

        expect(
            parseUiRepetition({
                [PROP_MOST_RECENT]: 2,
                [PROP_OLDEST]: 0,
            })
        ).toEqual([-1, 0])

        expect(
            parseUiRepetition({
                [PROP_MOST_RECENT]: 2,
                [PROP_OLDEST]: 1,
            })
        ).toEqual([1, -1, 0])

        expect(
            parseUiRepetition({
                [PROP_MOST_RECENT]: 1,
                [PROP_OLDEST]: 2,
            })
        ).toEqual([1, 2, 0])

        expect(
            parseUiRepetition({
                [PROP_MOST_RECENT]: 2,
                [PROP_OLDEST]: 2,
            })
        ).toEqual([1, 2, -1, 0])
    })
})

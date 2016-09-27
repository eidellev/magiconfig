'use strict'

module.exports = {
    /**
     * Checks fucntion is runnig in Node or in a browser
     * @return {Boolean}
     */
    isNode: function () {
        if (typeof module !== 'undefined' && module.exports) {
            return true
        }

        return false
    }
}

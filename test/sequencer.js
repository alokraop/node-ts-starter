const Sequencer = require('@jest/test-sequencer').default;

class E2ESequencer extends Sequencer {
    sort(tests) {
        const copyTests = Array.from(tests);
        const sorted = copyTests.sort((testA, testB) => (testA.path > testB.path ? 1 : -1));
        return sorted;
    }
}

module.exports = E2ESequencer;

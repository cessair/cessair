export default class StateMachine {
    constructor(block) {
        Object.assign(this, { beforeEach() {}, afterEach() {}, ...block });
    }

    static execute(block) {
        return new StateMachine(block).execute();
    }

    execute() {
        const { sharedStorage, completionCondition, beforeEach, afterEach } = this;

        for(let state = this.initialState; !completionCondition(sharedStorage);) {
            beforeEach(sharedStorage);

            state = this[state](sharedStorage);

            afterEach(sharedStorage);
        }
    }
}

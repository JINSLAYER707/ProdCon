function pickStake(state, scenario, sessionObject) {
    const currentStage = state.stage?.trim();
    const prevStage = sessionObject.currentStage?.trim();

    console.log("currentStage:", currentStage);
    console.log("prevStage:", prevStage);

    const stageToUse =
        state.confidence > 0.7 && currentStage !== prevStage
            ? currentStage
            : prevStage;

    console.log("stageToUse:", stageToUse);

    const priorityList =
        scenario.stakeholderPriority[stageToUse];

    console.log("priorityList:", priorityList);

    if (!priorityList) {
        throw new Error(
            `No stakeholderPriority found for stage '${stageToUse}'`
        );
    }

    const randomIndex =
        Math.floor(Math.random() * priorityList.length);

    const selected = priorityList[randomIndex];

    console.log("selected:", selected);

    console.log(
        "available roles:",
        scenario.stakeholders.map(s => s.role)
    );

    const stakeholderObj =
        scenario.stakeholders.find(
            s => s.role === selected
        );

    console.log("stakeholderObj:", stakeholderObj);

    if (!stakeholderObj) {
        throw new Error(
            `Stakeholder '${selected}' not found in stakeholders array`
        );
    }

    return {
        stakeholder: selected,
        personality: stakeholderObj.personality
    };
}

module.exports = { pickStake };
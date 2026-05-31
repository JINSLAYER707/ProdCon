require("dotenv").config();

const { orchestrate } =
require("../services/orchestrator");

const productSenseTemplate =
require("../templates/product_sense");

async function main(){

    const sessionObject = {

        category:"product_sense",

        company:"Spotify",

        industry:"Music Streaming",

        problemStatement:
        "Spotify retention among first-time users has dropped by 15% over the last quarter.",

        businessContext:
        "Management believes onboarding may be contributing to poor retention but no root cause has been confirmed.",

        currentStage:"problem_discovery",

        stakeholders:[
            {
                role:"Designer",
                personality:"UX focused",
                concern:"onboarding complexity"
            },

            {
                role:"Engineer",
                personality:"skeptical",
                concern:"technical feasibility"
            },

            {
                role:"CEO",
                personality:"growth focused",
                concern:"retention"
            },

            {
                role:"Product Lead",
                personality:"strategic",
                concern:"long term engagement"
            }
        ],

        conversation:[

            {
                role:"system",
                message:
                "Spotify retention among first-time users has dropped by 15%."
            },

            {
                role:"stakeholder",
                stakeholderRole:"CEO",
                message:
                "We need to understand why new users are leaving."
            },

            {
                role:"user",
                message:
                "I would first segment users and analyze retention by onboarding cohort."
            }

        ]
    };

    const result =
    await orchestrate(
        sessionObject,
        productSenseTemplate
    );

    console.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );
}

main();
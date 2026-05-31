const mongoose = require("mongoose");

/* =========================================
   USER SCHEMA
========================================= */

const UserSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    password:{
        type:String,
        required:true
    },

    previousRounds:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"PracticeSession"
        }
    ],

    points:{
        type:Number,
        default:0
    },

    averageScore:{
        type:Number,
        default:0
    },

    strengths:[
        {
            type:String
        }
    ],

    weaknesses:[
        {
            type:String
        }
    ]
},
{
    timestamps:true
}
);

/* =========================================
   EVALUATION SCHEMA
========================================= */

const EvaluationSchema = new mongoose.Schema(
{
    stage:{
        type:String,

        enum:[
            "problem_discovery",
            "solution_exploration",
            "tradeoff_analysis",
            "final_recommendation"
        ],

        required:true
    },

    userAnswer:{
        type:String,
        required:true
    },

    scores:{

        productThinking:{
            type:Number,
            min:0,
            max:10,
            default:0
        },

        metricsThinking:{
            type:Number,
            min:0,
            max:10,
            default:0
        },

        prioritization:{
            type:Number,
            min:0,
            max:10,
            default:0
        },

        tradeoffAnalysis:{
            type:Number,
            min:0,
            max:10,
            default:0
        },

        communicationClarity:{
            type:Number,
            min:0,
            max:10,
            default:0
        },

        userEmpathy:{
            type:Number,
            min:0,
            max:10,
            default:0
        }
    },

    strengths:[
        {
            type:String
        }
    ],

    weaknesses:[
        {
            type:String
        }
    ],

    aiFeedback:{
        type:String
    }
},
{
    _id:false
}
);

/* =========================================
   CONVERSATION SCHEMA
========================================= */

const ConversationSchema = new mongoose.Schema(
{
    role:{
        type:String,

        enum:[
            "system",
            "user",
            "stakeholder"
        ],

        required:true
    },

    stakeholderRole:{
        type:String
    },

    message:{
        type:String,
        required:true
    },

    timestamp:{
        type:Date,
        default:Date.now
    }
},
{
    _id:false
}
);

/* =========================================
   STAKEHOLDER SCHEMA
========================================= */

const StakeholderSchema = new mongoose.Schema(
{
    role:{
        type:String,
        required:true
    },

    personality:{
        type:String,
        required:true
    },

    concern:{
        type:String
    },

    mood:{
        type:String,
        default:"neutral"
    }
},
{
    _id:false
}
);

/* =========================================
   STAGE HISTORY SCHEMA
========================================= */

const StageHistorySchema = new mongoose.Schema(
{
    stage:{
        type:String,

        enum:[
            "problem_discovery",
            "solution_exploration",
            "tradeoff_analysis",
            "final_recommendation"
        ]
    },

    timestamp:{
        type:Date,
        default:Date.now
    }
},
{
    _id:false
}
);

/* =========================================
   PRACTICE SESSION SCHEMA
========================================= */

const PracticeSessionSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    category:{
        type:String,

        enum:[
            "product_sense",
            "product_strategy",
            "product_execution"
        ],

        required:true
    },

    difficulty:{
        type:String,

        enum:[
            "easy",
            "medium",
            "hard"
        ],

        default:"medium"
    },

    company:{
        type:String,
        required:true
    },

    industry:{
        type:String,
        required:true
    },

    problemStatement:{
        type:String,
        required:true
    },

    businessContext:{
        type:String,
        required:true
    },

    constraints:[
        {
            type:String
        }
    ],

    metrics:{
        type:mongoose.Schema.Types.Mixed
    },

    stakeholders:[
        StakeholderSchema
    ],

    currentStakeholder:{
        role:{
            type:String
        },

        personality:{
            type:String
        }
    },

    currentStage:{
        type:String,

        enum:[
            "problem_discovery",
            "solution_exploration",
            "tradeoff_analysis",
            "final_recommendation"
        ],

        default:"problem_discovery"
    },

    stageConfidence:{
        type:Number,
        default:1
    },

    stageHistory:[
        StageHistorySchema
    ],

    status:{
        type:String,

        enum:[
            "in_progress",
            "completed"
        ],

        default:"in_progress"
    },

    conversation:[
        ConversationSchema
    ],

    evaluations:[
        EvaluationSchema
    ],

    finalScore:{
        type:Number,
        default:0
    },

    finalFeedback:{
        type:String
    }
},
{
    timestamps:true
}
);

/* =========================================
   MODELS
========================================= */

const User = mongoose.model(
    "User",
    UserSchema
);

const PracticeSession = mongoose.model(
    "PracticeSession",
    PracticeSessionSchema
);

module.exports = {
    User,
    PracticeSession
};
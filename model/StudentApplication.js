import mongoose , {Schema} from "mongoose";

/**
 * This schema assumes you have a 'User' model.
 * The 'user' field will store the ObjectId of the student 
 * who is filling out this application form.
 */

const studentApplicationSchema = new Schema({
    
    // --- Form Management (Your new fields) ---
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // This links to your 'User' model
        required: true
    },
    formStatus: {
        type: String,
        enum: ['pending', 'reviewed', 'approved', 'rejected'],
        default: 'pending'
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    formSubmitDate: {
        type: Date,
        default: Date.now  // Sets to the current date/time on creation
    },

    // --- Personal Details ---
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        unique: true // Assumes one application per email
    },
    mobile: {
        type: String,
        // required: [true, 'Mobile number is required'],
        trim: true
        // You can add validation for length or format
    },
    dob: {
        type: Date,
        required: [true, 'Date of Birth is required']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    aadhaar: {
        type: String,
        required: [true, 'Aadhaar number is required'],
        trim: true,
        // unique: true // Assumes one application per Aadhaar
        // You can add validation for length (12)
    },

    // --- Academic Details ---
    college: {
        type: String,
        // required: true,
        default: 'Rajgad Technical Campus'
    },
    course: {
        type: String,
        required: true,
        trim: true
    },
    branch: {
        type: String,
        trim: true
    },
    year: {
        type: Number, // Switched to Number, Mongoose will cast "2" to 2
        required: true
    },

    // --- Family Details ---
    fatherName: {
        type: String,
        required: true,
        trim: true
    },
    fatherAlive: {
        type: String,
        enum: ['yes', 'no'],
        default: 'yes'
    },
    fatherOccupation: {
        type: String,
        trim: true
    },
    fatherSalaried: {
        type: String,
        enum: ['yes', 'no'],
        default: 'no'
    },
    motherName: {
        type: String,
        required: true,
        trim: true
    },
    motherAlive: {
        type: String,
        enum: ['yes', 'no'],
        default: 'yes'
    },
    motherOccupation: {
        type: String,
        trim: true
    },
    motherSalaried: {
        type: String,
        enum: ['yes', 'no'],
        default: 'no'
    },

    // --- Address Details ---
    permanentAddress: { // e.g., House No, Street
        type: String,
        required: true,
        trim: true
    },
    permanentVillage: {
        type: String,
        required: true,
        trim: true
    },
    permanentTaluka: {
        type: String,
        required: true,
        trim: true
    },
    permanentDistrict: {
        type: String,
        required: true,
        trim: true
    },
    permanentState: {
        type: String,
        required: true,
        trim: true
    },
    permanentPincode: {
        type: String,
        required: true,
        trim: true
        // You can add validation for length (6)
    },

    // --- Hostel / Mess Details ---
    roomType: {
        type: String,
        default: ''
    },
    roomno: {
        type: String, // Kept as String to allow room "A-101"
        default: ''
    },
    messPreference: {
        type: String,
        default: ''
    },
    dietaryRestrictions: {
        type: String,
        default: ''
    }
}, {
    // This is a good practice.
    // It automatically adds `createdAt` and `updatedAt` fields.
    // `createdAt` will be very similar to your `formSubmitDate`.
    timestamps: true 
});

// Create and export the model
export const StudentApplication = mongoose.model('StudentApplication', studentApplicationSchema);


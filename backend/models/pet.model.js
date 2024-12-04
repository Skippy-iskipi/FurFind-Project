import mongoose from "mongoose";

const DOG_BREEDS = [
	'Aspin',
	'Labrador',
	'German Shepherd',
	'Golden Retriever',
	'American Bully',
	'Chow-chow',
	'Bulldog',
	'Poodle',
	'Beagle',
	'Rottweiler',
	'Dachshund',
	'Pomeranian',
	'Pug',
	'Chihuahua',
	'Husky',
	'Shih Tzu',
	'Mixed Breed'
];

const CAT_BREEDS = [
	'Puspin',
	'Persian',
	'Maine Coon',
	'Siamese',
	'British Shorthair',
	'Ragdoll',
	'American Shorthair',
	'Scottish Fold',
	'Sphynx',
	'Bengal',
	'Russian Blue',
	'Abyssinian',
	'Norwegian Forest Cat',
	'Domestic Shorthair',
	'Domestic Longhair',
	'Mixed Breed'
];

const petSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
	name: {
		type: String,
		required: true
	},
	classification: {
		type: String,
		enum: ['Dog', 'Cat'],
		required: true
	},
	breed: {
		type: String,
		required: true,
		validate: {
			validator: function(v) {
				if (this.classification === 'Dog') {
					return DOG_BREEDS.includes(v);
				} else if (this.classification === 'Cat') {
					return CAT_BREEDS.includes(v);
				}
				return false;
			},
			message: props => `${props.value} is not a valid breed for the selected classification!`
		}
	},
	age: {
		type: String,
		enum: ["Baby", "Young", "Teenager", "Adult"],
		required: true,
	},
	gender: {
		type: String,
		enum: ["Male", "Female"],
		required: true,
	},
	location: {
		type: String,
		enum: [
			"Abucay",
			"Bagac",
			"Balanga",
			"Dinalupihan",
			"Hermosa",
			"Limay",
			"Mariveles",
			"Morong",
			"Orani",
			"Orion",
			"Pilar",
			"Samal",
		],
		required: true,
	},
	status: {
		type: String,
		enum: ["Available", "Adopted"],
		default: "Available",
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
}, {
		timestamps: true,
	}
);

const Pet = mongoose.model('Pet', petSchema);

export default Pet;

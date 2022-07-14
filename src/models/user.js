const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	bio: String,
	photos: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Photo',
			autopopulate: true,
		},
	],
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Photo',
		},
	],
	createdAt: {
		type: Date,
		default: new Date(),
	},
})

class User {
	greet(person) {
		console.log(`Hello ${person.name}, this is ${this.name}`)
	}

	addPhoto(photo) {
		this.photos.push(photo)
	}

	likePhoto(photo) {
		this.likes.push(photo)
		photo.likedBy.push(this)
	}

	get profile() {
		return `
      # ${this.name} (${this.age})
      Bio: ${this.bio}
      ## Photos (${this.photos.length})
      ${this.photos
				.map(photo => {
					return `### ${photo.filename}
          🤩 ${photo.likedBy.map(person => person.name).join(', ') || 'no likes yet!'}
          `
				})
				.join('\n')}
    `
	}

	set profile(newValue) {
		throw new Error(`profile is only a getter. You can't override it with ${newValue}.`)
	}
}

userSchema.loadClass(User)
userSchema.plugin(autopopulate)

module.exports = mongoose.model('User', userSchema)

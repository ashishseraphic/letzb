let mongoose = require("./db.server.connect"),
  Schema = mongoose.Schema;

let QuestionSchema = new Schema({
  questionNumber: {
    type: Number,
  },
  type: {
    type: String,
  },
  question: {
    type: String,
  },
  filterName: {
    type: String,
  },
  options: [
    {
      image: {
        type: String,
      },
      title: {
        type: String,
      },
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
let questionModel = mongoose.model("questions", QuestionSchema);
// questionModel
//     .insertMany([{
//         "_id" : "5ebbd4e76b197f36fc47211e",
//         "questionNumber" : 1,
//         "type" : "2-block",
//          "filterName":"I like meeting up for...",
//         "question" : "I like meeting up for...",
//         "options" : [
//             {
//                 "_id" : "5ebbd4e76b197f36fc47211f",
//                 "image" : "/Qusetion1/Coffee.png",
//                 "title" : "Coffee",
//                 "modified_at" : "2020-05-13T11:07:19.830Z",
//                 "created_at" : "2020-05-13T11:07:19.830Z"
//             },
//             {
//                 "_id" : "5ebbd6796b197f36fc472122",
//                 "image" : "/Qusetion1/Drinks.png",
//                 "title" : "Drinks"
//             },
//             {
//                 "_id" : "5ebbd6bd6b197f36fc472123",
//                 "image" : "/Qusetion1/Marijuana.png",
//                 "title" : "Marijuana"
//             },
//             {
//                 "_id" : "5ebbd7016b197f36fc472124",
//                 "image" : "/Qusetion1/PreferNottoSay.png",
//                 "title" : "Prefer Not To Say"
//             }
//         ],
//         "modified_at" : "2020-05-13T11:16:17.867Z",
//         "created_at" : "2020-05-13T11:07:19.830Z",
//         "__v" : 0
//     },
//     {
//         "_id" : "5ebbd5516b197f36fc472120",
//         "questionNumber" : 2,
//         "type" : "3-block",
//          "filterName":"Horoscopes",
//         "question" : "What is your horoscope?",
//         "options" : [
//             {
//                 "_id" : "5ebbd5516b197f36fc472121",
//                 "image" : "/Qusetion2/Aquarius.png",
//                 "title" : "Aquarius",
//                 "modified_at" : "2020-05-13T11:09:05.932Z",
//                 "created_at" : "2020-05-13T11:09:05.932Z"
//             },
//             {
//                 "_id" : "5ebbd7616b197f36fc472125",
//                 "image" : "/Qusetion2/Pisces.png",
//                 "title" : "Pisces"
//             },
//             {
//                 "_id" : "5ebbd7de6b197f36fc472126",
//                 "image" : "/Qusetion2/Taurus.png",
//                 "title" : "Taurus"
//             },
//             {
//                 "_id" : "5ebbd8076b197f36fc472127",
//                 "image" : "/Qusetion2/Gemini.png",
//                 "title" : "Gemini"
//             },
//             {
//                 "_id" : "5ebbd81a6b197f36fc472128",
//                 "image" : "/Qusetion2/Cancer.png",
//                 "title" : "Cancer"
//             },
//             {
//                 "_id" : "5ebbd85e6b197f36fc472129",
//                 "image" : "/Qusetion2/Leo.png",
//                 "title" : "Leo"
//             },
//             {
//                 "_id" : "5ebbd8816b197f36fc47212a",
//                 "image" : "/Qusetion2/Virgo.png",
//                 "title" : "Virgo"
//             },
//             {
//                 "_id" : "5ebbd89e6b197f36fc47212b",
//                 "image" : "/Qusetion2/Libra.png",
//                 "title" : "Libra"
//             },
//             {
//                 "_id" : "5ebbd8c86b197f36fc47212c",
//                 "image" : "/Qusetion2/Scorpio.png",
//                 "title" : "Scorpio"
//             },
//             {
//                 "_id" : "5ebbd8e86b197f36fc47212d",
//                 "image" : "/Qusetion2/Sagittarius.png",
//                 "title" : "Sagittarius"
//             },
//             {
//                 "_id" : "5ebbd9196b197f36fc47212e",
//                 "image" : "/Qusetion2/Capricorn.png",
//                 "title" : "Capricorn"
//             },
//             {
//                 "_id" : "5ebbd9856b197f36fc47212f",
//                 "image" : "/Qusetion2/Aries.png",
//                 "title" : "Aries"
//             }
//         ],
//         "modified_at" : "2020-05-13T11:27:01.088Z",
//         "created_at" : "2020-05-13T11:09:05.933Z",
//         "__v" : 0
//     },
//     {
//         "_id" : "5ebbd9e56b197f36fc472130",
//         "questionNumber" : 3,
//         "type" : "2-block",
//          "filterName":"Schedule",
//         "question" : "My Schedule is",
//         "options" : [
//             {
//                 "_id" : "5ebbd9e56b197f36fc472131",
//                 "image" : "/Qusetion3/Student.png",
//                 "title" : "Student",
//                 "modified_at" : "2020-05-13T11:28:37.355Z",
//                 "created_at" : "2020-05-13T11:28:37.355Z"
//             },
//             {
//                 "_id" : "5ebbda086b197f36fc472132",
//                 "image" : "/Qusetion3/Entrepreneur.png",
//                 "title" : "Entrepreneur"
//             },
//             {
//                 "_id" : "5ebbda286b197f36fc472133",
//                 "image" : "/Qusetion3/Nightlife.png",
//                 "title" : "Nightlife"
//             },
//             {
//                 "_id" : "5ebbda476b197f36fc472134",
//                 "image" : "/Qusetion3/BusinessOwner.png",
//                 "title" : "Business Owner"
//             },
//             {
//                 "_id" : "5ebbda696b197f36fc472135",
//                 "image" : "/Qusetion3/9-5Professional.png",
//                 "title" : "9-5 Professional"
//             },
//             {
//                 "_id" : "5ebbda846b197f36fc472136",
//                 "image" : "/Qusetion3/PreferNottoSay.png",
//                 "title" : "Prefer Not To Say"
//             }
//         ],
//         "modified_at" : "2020-05-13T11:31:16.220Z",
//         "created_at" : "2020-05-13T11:28:37.355Z",
//         "__v" : 0
//     },
//     {
//         "_id" : "5ebbdac06b197f36fc472137",
//         "questionNumber" : 4,
//         "type" : "2-block",
//          "filterName":"Searching for",
//         "question" : "I am searching for",
//         "options" : [
//             {
//                 "_id" : "5ebbdac06b197f36fc472138",
//                 "image" : "/Qusetion4/Friendship.png",
//                 "title" : "Friendship",
//                 "modified_at" : "2020-05-13T11:32:16.689Z",
//                 "created_at" : "2020-05-13T11:32:16.689Z"
//             },
//             {
//                 "_id" : "5ebbdb0a6b197f36fc472139",
//                 "image" : "/Qusetion4/Relationship.png",
//                 "title" : "Relationship"
//             },
//             {
//                 "_id" : "5ebbdb1d6b197f36fc47213a",
//                 "image" : "/Qusetion4/Networking.png",
//                 "title" : "Networking"
//             },
//             {
//                 "_id" : "5ebbdb3e6b197f36fc47213b",
//                 "image" : "/Qusetion4/MeetTonight.png",
//                 "title" : "Meet Tonight"
//             },
//             {
//                 "_id" : "5ebbdb5a6b197f36fc47213c",
//                 "image" : "/Qusetion4/OpenRelationship.png",
//                 "title" : "Open Relationship"
//             },
//             {
//                 "_id" : "5ebbdb766b197f36fc47213d",
//                 "image" : "/Qusetion4/PreferNottoSay.png",
//                 "title" : "Prefer Not To Say"
//             }
//         ],
//         "modified_at" : "2020-05-13T11:35:18.163Z",
//         "created_at" : "2020-05-13T11:32:16.689Z",
//         "__v" : 0
//     },
//     {
//         "_id" : "5ebbdbac6b197f36fc47213e",
//         "questionNumber" : 5,
//         "type" : "2-block",
//          "filterName":"Ideal First Date",
//         "question" : "My ideal first date",
//         "options" : [
//             {
//                 "_id" : "5ebbdbac6b197f36fc47213f",
//                 "image" : "/Qusetion5/Netflix&Chill.png",
//                 "title" : "Netflix & Chill",
//                 "modified_at" : "2020-05-13T11:36:12.321Z",
//                 "created_at" : "2020-05-13T11:36:12.321Z"
//             },
//             {
//                 "_id" : "5ebbdbde6b197f36fc472140",
//                 "image" : "/Qusetion5/RomanticDinner.png",
//                 "title" : "Romantic Dinner"
//             },
//             {
//                 "_id" : "5ebbdc056b197f36fc472141",
//                 "image" : "/Qusetion5/OutdoorAdventures.png",
//                 "title" : "Outdoor Adventures"
//             },
//             {
//                 "_id" : "5ebbdc246b197f36fc472142",
//                 "image" : "/Qusetion5/MuseumTour.png",
//                 "title" : "Museum Tour"
//             },
//             {
//                 "_id" : "5ebbdc3e6b197f36fc472143",
//                 "image" : "/Qusetion5/Theater.png",
//                 "title" : "Theater"
//             },
//             {
//                 "_id" : "5ebbdc526b197f36fc472144",
//                 "image" : "/Qusetion5/Concert.png",
//                 "title" : "Concert"
//             }
//         ],
//         "modified_at" : "2020-05-13T11:38:58.709Z",
//         "created_at" : "2020-05-13T11:36:12.322Z",
//         "__v" : 0
//     },
//     {
//         "_id" : "5ebbdc846b197f36fc472145",
//         "questionNumber" : 6,
//         "type" : "2-block",
//          "filterName":"Body Type",
//         "question" : "My body type",
//         "options" : [
//             {
//                 "_id" : "5ebbdc846b197f36fc472146",
//                 "image" : "/Qusetion6/Skinny.png",
//                 "title" : "Skinny",
//                 "modified_at" : "2020-05-13T11:39:48.130Z",
//                 "created_at" : "2020-05-13T11:39:48.130Z"
//             },
//             {
//                 "_id" : "5ebbdcac6b197f36fc472147",
//                 "image" : "/Qusetion6/Athletic.png",
//                 "title" : "Athletic"
//             },
//             {
//                 "_id" : "5ebbdcc06b197f36fc472148",
//                 "image" : "/Qusetion6/Plus.png",
//                 "title" : "Plus"
//             },
//             {
//                 "_id" : "5ebbdcd66b197f36fc472149",
//                 "image" : "/Qusetion6/Average.png",
//                 "title" : "Average"
//             },
//             {
//                 "_id" : "5ebbdceb6b197f36fc47214a",
//                 "image" : "/Qusetion6/PreferNottoSay.png",
//                 "title" : "Prefer Not To Say"
//             }
//         ],
//         "modified_at" : "2020-05-13T11:41:31.695Z",
//         "created_at" : "2020-05-13T11:39:48.131Z",
//         "__v" : 0
//     },
//     {
//         "_id" : "5ebbdd2b6b197f36fc47214b",
//         "questionNumber" : 7,
//         "type" : "2-block",
//          "filterName":"Love Language",
//         "question" : "My love language is",
//         "options" : [
//             {
//                 "_id" : "5ebbdd2b6b197f36fc47214c",
//                 "image" : "/Qusetion7/ActsofService.png",
//                 "title" : "Acts of Service",
//                 "modified_at" : "2020-05-13T11:42:35.049Z",
//                 "created_at" : "2020-05-13T11:42:35.049Z"
//             },
//             {
//                 "_id" : "5ebbdd946b197f36fc47214d",
//                 "image" : "/Qusetion7/PhysicalTouch.png",
//                 "title" : "Physical Touch"
//             },
//             {
//                 "_id" : "5ebbddad6b197f36fc47214e",
//                 "image" : "/Qusetion7/WordsofAffirmation.png",
//                 "title" : "Words of Affirmation"
//             },
//             {
//                 "_id" : "5ebbddc46b197f36fc47214f",
//                 "image" : "/Qusetion7/GiftGiving.png",
//                 "title" : "Gift Giving"
//             },
//             {
//                 "_id" : "5ebbdde76b197f36fc472150",
//                 "image" : "/Qusetion7/QualityTime.png",
//                 "title" : "Quality Time"
//             }
//         ],
//         "modified_at" : "2020-05-13T11:45:43.479Z",
//         "created_at" : "2020-05-13T11:42:35.049Z",
//         "__v" : 0
//     },
//     {
//         "_id" : "5ebbde1c6b197f36fc472151",
//         "questionNumber" : 8,
//         "type" : "2-block",
//          "filterName":"Lifestyle",
//         "question" : "Lifestyle",
//         "options" : [
//             {
//                 "_id" : "5ebbde1c6b197f36fc472152",
//                 "image" : "/Qusetion8/EarlyBird.png",
//                 "title" : "Early Bird",
//                 "modified_at" : "2020-05-13T11:46:36.046Z",
//                 "created_at" : "2020-05-13T11:46:36.046Z"
//             },
//             {
//                 "_id" : "5ebbdf6c6b197f36fc47215d",
//                 "image" : "/Qusetion8/NightOwl.png",
//                 "title" : "Night Owl"
//             },
//             {
//                 "_id" : "5ebbdf886b197f36fc47215e",
//                 "image" : "/Qusetion8/GymRat.png",
//                 "title" : "Gym Rat"
//             },
//             {
//                 "_id" : "5ebbdf9e6b197f36fc47215f",
//                 "image" : "/Qusetion8/BookWorm.png",
//                 "title" : "Book Worm"
//             },
//             {
//                 "_id" : "5ebbdfbc6b197f36fc472160",
//                 "image" : "/Qusetion8/PreferNottoSay.png",
//                 "title" : "Prefer Not To Say"
//             }
//         ],
//         "modified_at" : "2020-05-13T11:53:32.586Z",
//         "created_at" : "2020-05-13T11:46:36.046Z",
//         "__v" : 0
//     },
//     {
//         "_id" : "5ebbdedb6b197f36fc472157",
//         "questionNumber" : 9,
//         "type" : "2-block",
//          "filterName":"Sexual Preference",
//         "question" : "Sexual Preference",
//         "options" : [
//             {
//                 "_id" : "5ebbdedb6b197f36fc472158",
//                 "image" : "/Qusetion9/Bottom.png",
//                 "title" : "Bottom",
//                 "modified_at" : "2020-05-13T11:49:47.531Z",
//                 "created_at" : "2020-05-13T11:49:47.531Z"
//             },
//             {
//                 "_id" : "5ebbdf046b197f36fc472159",
//                 "image" : "/Qusetion9/Top.png",
//                 "title" : "Top"
//             },
//             {
//                 "_id" : "5ebbdf206b197f36fc47215b",
//                 "image" : "/Qusetion9/Verse.png",
//                 "title" : "Verse"
//             },
//             {
//                 "_id" : "5ebbdf376b197f36fc47215c",
//                 "image" : "/Qusetion9/PreferNottoSay.png",
//                 "title" : "Prefer Not To Say"
//             }
//         ],
//         "modified_at" : "2020-05-13T11:51:19.792Z",
//         "created_at" : "2020-05-13T11:49:47.531Z",
//         "__v" : 0
//     },
//     {
//         "_id" : "5ebbe00e6b197f36fc472161",
//         "questionNumber" : 10,
//         "type" : "2-block",
//         "filterName":"Sexual Orientation",
//         "question" : "My Sexuality",
//         "options" : [
//             {
//                 "_id" : "5ebbe00e6b197f36fc472162",
//                 "image" : "/Qusetion10/Pansexual.png",
//                 "title" : "Pansexual",
//                 "modified_at" : "2020-05-13T11:54:54.762Z",
//                 "created_at" : "2020-05-13T11:54:54.762Z"
//             },
//             {
//                 "_id" : "5ebbe0386b197f36fc472163",
//                 "image" : "/Qusetion10/Lesbian.png",
//                 "title" : "Lesbian"
//             },
//             {
//                 "_id" : "5ebbe04d6b197f36fc472164",
//                 "image" : "/Qusetion10/Bisexual.png",
//                 "title" : "Bisexual"
//             },
//             {
//                 "_id" : "5ebbe0776b197f36fc472165",
//                 "image" : "/Qusetion10/Asexual.png",
//                 "title" : "Asexual"
//             },
//             {
//                 "_id" : "5ebbe09d6b197f36fc472166",
//                 "image" : "/Qusetion10/Genderqueer.png",
//                 "title" : "Genderqueer"
//             },
//             {
//                 "_id" : "5ebbe0af6b197f36fc472167",
//                 "image" : "/Qusetion10/Other.png",
//                 "title" : "Other"
//             }
//         ],
//         "modified_at" : "2020-05-13T11:57:35.072Z",
//         "created_at" : "2020-05-13T11:54:54.762Z",
//         "__v" : 0
//     },
//     {
//         "_id" : "5ebbe0f56b197f36fc472168",
//         "questionNumber" : 11,
//         "type" : "2-block",
//         "filterName":"Relationship Status",
//         "question" : "Relationship Status",
//         "options" : [
//             {
//                 "_id" : "5ebbe0f56b197f36fc472169",
//                 "image" : "/Qusetion11/Single.png",
//                 "title" : "Single",
//                 "modified_at" : "2020-05-13T11:58:45.727Z",
//                 "created_at" : "2020-05-13T11:58:45.727Z"
//             },
//             {
//                 "_id" : "5ebbe11c6b197f36fc47216a",
//                 "image" : "/Qusetion11/Polyamorous.png",
//                 "title" : "Polyamorous"
//             },
//             {
//                 "_id" : "5ebbe12c6b197f36fc47216b",
//                 "image" : "/Qusetion11/Monogymous.png",
//                 "title" : "Monogymous"
//             },
//             {
//                 "_id" : "5ebbe1406b197f36fc47216c",
//                 "image" : "/Qusetion11/Married.png",
//                 "title" : "Married"
//             },
//             {
//                 "_id" : "5ebbe1596b197f36fc47216d",
//                 "image" : "/Qusetion11/PreferNottoSay.png",
//                 "title" : "Prefer Not To Say"
//             }
//         ],
//         "modified_at" : "2020-05-13T12:00:25.471Z",
//         "created_at" : "2020-05-13T11:58:45.727Z",
//         "__v" : 0
//     },

//     {
//         "_id" : "5ebbe1aa6b197f36fc47216e",
//         "questionNumber" : 12,
//         "type" : "3-block",
//          "filterName":"Gender Identity",
//         "question" : "Gender Identity?",
//         "options" : [
//             {
//                 "_id" : "5ebbe1aa6b197f36fc47216f",
//                 "image" : "/Qusetion12/CisWoman.png",
//                 "title" : "CisWoman",
//                 "modified_at" : "2020-05-13T12:01:46.376Z",
//                 "created_at" : "2020-05-13T12:01:46.376Z"
//             },
//             {
//                 "_id" : "5ebbe1f56b197f36fc472170",
//                 "image" : "/Qusetion12/Intersex.png",
//                 "title" : "Intersex"
//             },
//             {
//                 "_id" : "5ebbe21e6b197f36fc472171",
//                 "image" : "/Qusetion12/TransWoman.png",
//                 "title" : "Trans Woman"
//             },
//             {
//                 "_id" : "5ebbe2326b197f36fc472172",
//                 "image" : "/Qusetion12/TransMan.png",
//                 "title" : "Trans Man"
//             },
//             {
//                 "_id" : "5ebbe28f6b197f36fc472173",
//                 "image" : "/Qusetion12/NonBinary.png",
//                 "title" : "Non-Binary"
//             },
//             {
//                 "_id" : "5ebbe2a46b197f36fc472174",
//                 "image" : "/Qusetion12/Genderqueer.png",
//                 "title" : "Genderqueer"
//             },
//             {
//                 "_id" : "5ebbe2c56b197f36fc472176",
//                 "image" : "/Qusetion12/Androgynous.png",
//                 "title" : "Androgynous"
//             },
//             {
//                 "_id" : "5ebbe2eb6b197f36fc472177",
//                 "image" : "/Qusetion12/Gender-fluid.png",
//                 "title" : "Gender-fluid"
//             },
//             {
//                 "_id" : "5ebbe2fa6b197f36fc472178",
//                 "image" : "/Qusetion12/Gender-neutral.png",
//                 "title" : "Gender-Neutral"
//             },
//             {
//                 "_id" : "5ebbe30e6b197f36fc472179",
//                 "image" : "/Qusetion12/Butch.png",
//                 "title" : "Butch"
//             },
//             {
//                 "_id" : "5ebbe3316b197f36fc47217c",
//                 "image" : "/Qusetion12/LipstickLesbian.png",
//                 "title" : "Lipstick Lesbian"
//             },
//             {
//                 "_id" : "5ebbe3496b197f36fc47217d",
//                 "image" : "/Qusetion12/ChapsticLesbian.png",
//                 "title" : "Chapstic Lesbian"
//             },
//             {
//                 "_id" : "5ebbe3676b197f36fc47217e",
//                 "image" : "/Qusetion12/PreferNottoSay.png",
//                 "title" : "Prefer Not To Say"
//             }
//         ],
//         "modified_at" : "2020-05-13T12:09:11.185Z",
//         "created_at" : "2020-05-13T12:01:46.376Z",
//         "__v" : 0
//     }])
//     .then(() => {
//         console.log("Question added successfully");
//     })
//     .catch((error) => {
//         console.log("Erro adding question", error)
//     })
module.exports = questionModel;

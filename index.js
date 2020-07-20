const express = require("express");
const app = express();

const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

//data
const { courses } = require("./data.json");

// GrapqhQL Schema
const schema = buildSchema(`
  type Query {
    message: String
    course(id:Int!):Course
    courses:[Course]
  }

  type Mutation{
    updateCourseTitle(id:Int,title:String):Course
  }

  type Course{
      id:Int
      title:String
      author:String
      topic:String
  }
`);

let getCourse = (args) => {
  let id = args.id;
  return courses.filter((course) => course.id === id)[0];
};

let updateCourseTitle = ({ id, title }) => {
  courses.map((course) => {
    if (course.id === id) {
      course.title = title;
      return course;
    }
  });

  return courses.filter((course) => course.id === id)[0];
};

let getCourses = () => {
  return courses;
};

const root = {
  message: () => "Hello World!",
  course: getCourse,
  courses: getCourses,
  updateCourseTitle: updateCourseTitle,
};

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(3000, () => console.log("server on port:", 3000));

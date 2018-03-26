import { Component, OnInit } from '@angular/core';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})

export class CourseComponent implements OnInit {

  courses: Course[];
  adding: boolean = false;
  selectedItem = null;
  menu:boolean=true;
  adminMode:boolean=false;
  userMode:boolean=false;

  selectedAnswers:number[];

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService) {
    this.courses = [];
  }

  public data: any = [];

  asAdmin() {
    this.menu = false;
    this.adminMode = true;
    this.userMode = false;
  }

  asUser() {
    this.menu = false;
    this.adminMode = false;
    this.userMode = true;
  }

  backToMenu() {
    this.menu = true;
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  trim(s) {
    return s.replace(/^\s+|\s+$/g, '');
  };

  showCourseDetails(course) {
    course.showDetails = !course.showDetails;
    if (!course.showDetails) {
      course.showNewLessonDetails = false;
    }
  }

  showNewLessonDetails(course) {
    course.showNewLessonDetails = !course.showNewLessonDetails;
  }

  showLessons(course) {
    course.showLessons = !course.showLessons;
  }

  takeLesson(lesson) {
    lesson.showQuestionsAndAnswers = !lesson.showQuestionsAndAnswers;
  }

  toggleAdding() {
    this.adding = !this.adding;
  }

  add(name) {
    let lessons = [];
    let course = {
      name: name,
      lessons: lessons,
      showDetails: false,
      showNewLessonDetails: false,
      showLessons: false
    }

    this.courses.push(course);
    this.adding = false;
    this.saveInLocalStorage('courses', this.courses);
  }

  addNewLesson(course, name,
    word1, answers1,
    word2, answers2,
    word3, answers3,
    word4, answers4,
    word5, answers5) {

    answers1 = answers1.split(',')
    answers2 = answers2.split(',')
    answers3 = answers3.split(',')
    answers4 = answers4.split(',')
    answers5 = answers5.split(',')

    answers1 = answers1.map(this.trim);
    answers2 = answers2.map(this.trim);
    answers3 = answers3.map(this.trim);
    answers4 = answers4.map(this.trim);
    answers5 = answers5.map(this.trim);

    let questions = [];
    questions.push({ word: word1, correct_answer: answers1[0], answers: this.shuffle(answers1) });
    questions.push({ word: word2, correct_answer: answers2[0], answers: this.shuffle(answers2) });
    questions.push({ word: word3, correct_answer: answers3[0], answers: this.shuffle(answers3) });
    questions.push({ word: word4, correct_answer: answers4[0], answers: this.shuffle(answers4) });
    questions.push({ word: word5, correct_answer: answers5[0], answers: this.shuffle(answers5) });

    course.lessons.push({
      name: name,
      result: '',
      showQuestionsAndAnswers: false,
      questions
    });

    course.showDetails = false;
    course.showNewLessonDetails = false;
    this.adding = false;
    this.saveInLocalStorage('courses', this.courses);
  }

  handleClick(i, j) {
    this.selectedAnswers[i] = j;
  }

  delete(course) {
    for (let i = 0; i < this.courses.length; i++) {
      if (this.courses[i] == course) {
        this.courses.splice(i, 1);
        break;
      }
    }
    this.saveInLocalStorage('courses', this.courses);
  }

  checkResults(lesson) {
    console.log(lesson);
    let n = lesson.questions.length;
    let correct = 0;
    for (var i = 0; i < n; i++) {
      console.log(lesson.questions[i].answers[this.selectedAnswers[i]]);
      console.log(lesson.questions[i].correct_answer);
      if (lesson.questions[i].answers[this.selectedAnswers[i]] === lesson.questions[i].correct_answer) {
        correct++;
      }
    }
    this.selectedAnswers = [0, 0, 0, 0, 0];
    lesson.showQuestionsAndAnswers = false;
    lesson.result = ': ' + correct + '/' + n;
  }

  readFromLocalStorage(key): void {
    this.data[key] = this.storage.get(key);
  }

  saveInLocalStorage(key, val): void {
    this.storage.set(key, val);
    this.data[key] = this.storage.get(key);
  }

  ngOnInit() {
    this.selectedAnswers = [0, 0, 0, 0, 0];
    this.readFromLocalStorage('courses');
    if (this.data['courses']) {
      this.courses = this.data['courses'];
    }
  }
}
class Course {
  name: string;
  lessons: Lesson[];
  showDetails: boolean;
  showNewLessonDetails: boolean;
  showLessons: boolean;
}

class Lesson {
  name: string;
  result: string;
  showQuestionsAndAnswers:boolean;
  questions: Question[];
}

class Question {
  word: string;
  correct_answer: string;
  answers: string[];
}
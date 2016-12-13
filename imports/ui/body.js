/**
 * Created by phonglnh on 12/13/16.
 */
import { Template } from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import {Tasks} from '../api/task.js';
import './task.js';
import './body.html';


Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
});

Template.body.helpers({
   tasks(){
       const instance = Template.instance();
       if(instance.state.get('hideCompleted')){
           return Tasks.find({ checked: {$ne: true}}, {sort: {createdAt: -1}});
       }

     return Tasks.find({}, {sort : {createdAt: -1}});
   },
    incompleteCount(){
      return Tasks.find({checked: {$ne: true}}).count();
    },
});

Template.body.events({
    'submit .new-task'(event){
        event.preventDefault();

        const target = event.target;
        const text = target.text.value;

        Tasks.insert({
            text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });

        //console.log(event);

        target.text.value = '';
    },
    'change .hide-completed input'(event, instance){
        instance.state.set('hideCompleted', event.target.checked);
    },
});
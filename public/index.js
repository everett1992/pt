(function() {
  $(function() {
    var breaks, exercises, interset_breaks, level, minutes, next, set, sets, timer, workout, workout_id, workouts;
    $(document).on('keypress', function(a, b, c) {
      if (a.which === 32 || a.which === 13) {
        return $('#next').click();
      }
    });
    workouts = [
      {
        name: '1&1 Workout',
        each_time: 1,
        each_break: 1,
        sets_per_level: [3, 4, 6],
        between_sets: 3,
        exercises: ['High Knees', 'Jumping Jacks', 'Squats', 'Lunges', 'Plank Leg raises', 'Climbers', 'Bicycle Crunches', 'Leg Raises', 'Knee Pull-ins', 'Push-ups']
      }, {
        name: 'Abs On Fire',
        each_reps: 10,
        sets_per_level: [3, 5, 8],
        between_sets: 1,
        exercises: ['Windshield Wipers', 'Long Arm Crunches', 'Reverse Crunches', 'Bicycle Crunches', 'Modified V-sits', 'Heel Touches']
      }
    ];
    level = 0;
    workout_id = parseInt(window.location.hash.split('/').pop(), 10) || 1;
    workout = workouts[workout_id - 1];
    $('img.exercise').attr("src", "assets/images/" + (workout_id + 1) + ".jpg");
    $('.title').append($('<h1>').attr('class', 'name').text(workout.name));
    exercises = _(workout.exercises).map(function(exercise) {
      if (workout.each_time) {
        return {
          "class": 'exercise',
          title: exercise,
          time: workout.each_time
        };
      } else {
        return {
          "class": 'exercise',
          title: exercise,
          reps: workout.each_reps
        };
      }
    });
    if (workout.each_break) {
      breaks = _(exercises).map(function(exercise) {
        return {
          "class": 'break',
          title: 'Break',
          time: workout.each_break
        };
      });
      set = _.initial(_.flatten(_.zip(exercises, breaks)));
    } else {
      set = exercises;
    }
    sets = _(workout.sets_per_level[0]).times(function() {
      return set;
    });
    interset_breaks = _(sets).map(function() {
      return {
        "class": 'inter_set_break',
        title: 'Inter Set Break',
        time: workout.between_sets
      };
    });
    workout = _.initial(_.flatten(_.zip(sets, interset_breaks))).reverse();
    minutes = function(min) {
      return min * 1000 * 60;
    };
    timer = function(ms) {
      var end, update_time;
      end = Date.now() + ms;
      update_time = function() {
        $('.timer').html($('<h3>').text("" + ((end - Date.now()) / 1000) + " seconds left"));
        if (Date.now() <= end) {
          return setTimeout(update_time, 50);
        } else {
          return $('.timer').empty();
        }
      };
      return update_time();
    };
    next = function(list) {
      var item;
      item = list.pop();
      window.next = _.bind(next, this, list);
      if (item.time) {
        $('.activity').html($('<h1>').attr('class', item["class"]).text(item.title));
        timer(minutes(item.time));
        return setTimeout(window.next, minutes(item.time));
      } else if (item.reps) {
        $('.activity').html($('<h1>').attr('class', item["class"]).text("" + item.title + " x " + item.reps));
        return $('.activity').append($('<button>').attr('id', 'next').text('Next').click(window.next));
      }
    };
    return next(workout);
  });

}).call(this);

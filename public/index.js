(function() {
  $(function() {
    var breaks, exercises, interset_breaks, level, minutes, schedule, set, sets, timer, workout, workouts;
    workouts = [
      {
        name: '1&1 Workout',
        each_time: 1,
        each_break: 1,
        sets_per_level: [3, 4, 6],
        between_sets: 3,
        exercises: ['High Knees', 'Jumping Jacks', 'Squats', 'Lunges', 'Plank Leg raises', 'Climbers', 'Bicycle Crunches', 'Leg Raises', 'Knee Pull-ins', 'Push-ups']
      }
    ];
    level = 0;
    workout = workouts.pop();
    $('.title').append($('<h1>').attr('class', 'name').text(workout.name));
    exercises = _(workout.exercises).map(function(exercise) {
      return {
        "class": 'exercise',
        title: exercise,
        time: workout.each_time
      };
    });
    breaks = _(exercises).map(function(exercise) {
      return {
        "class": 'break',
        title: 'Break',
        time: workout.each_break
      };
    });
    set = _.initial(_.flatten(_.zip(exercises, breaks)));
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
    console.log(_(workout).map(function(w) {
      return w.title;
    }));
    minutes = function(min) {
      return min * 1000 * 60;
    };
    timer = function(duration) {
      var end, update_time;
      end = Date.now() + duration;
      update_time = function() {
        $('.timer').html($('<h3>').text("" + ((end - Date.now()) / 1000) + " seconds left"));
        if (Date.now() <= end) {
          return setTimeout(update_time, 50);
        }
      };
      return update_time();
    };
    schedule = function(list) {
      var item;
      item = list.pop();
      console.log(item.title);
      $('.activity').html($('<h1>').attr('class', item["class"]).text(item.title));
      timer(minutes(item.time));
      return setTimeout(_.bind(schedule, this, list), minutes(item.time));
    };
    return schedule(workout);
  });

}).call(this);

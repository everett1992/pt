$ ->
  workouts = [
    {
      name: '1&1 Workout'
      each_time: 1             # Minutes of each exercise
      each_break: 1            # Time between exercise
      sets_per_level: [ 3, 4, 6 ] # Number of sets at level 1, 2, 3
      between_sets: 3          # Minutes between each set
      exercises: [
        'High Knees',
        'Jumping Jacks',
        'Squats',
        'Lunges',
        'Plank Leg raises',
        'Climbers',
        'Bicycle Crunches',
        'Leg Raises',
        'Knee Pull-ins',
        'Push-ups' ]
    }
  ]

  level = 0
  workout = workouts.pop()

  $('.title').append($('<h1>')
    .attr('class', 'name')
    .text(workout.name)
  )


  exercises = _(workout.exercises).map (exercise) ->
    { class: 'exercise', title: exercise, time: workout.each_time }

  breaks = _(exercises).map (exercise) ->
    { class: 'break', title: 'Break', time: workout.each_break }

  # Set of exercises alternating with breaks.
  set = _.initial(_.flatten(_.zip(exercises, breaks)))

  # An array of n sets where n is the number of sets at the current level
  sets = _(workout.sets_per_level[0]).times -> set

  interset_breaks = _(sets).map ->
    { class: 'inter_set_break', title: 'Inter Set Break', time: workout.between_sets}

  workout = _.initial(_.flatten(_.zip(sets, interset_breaks))).reverse()
  console.log _(workout).map (w) ->
    w.title

  # Minutes to miliseconds
  minutes = (min) -> min * 1000 * 60

  timer = (duration) ->
    end = Date.now() + duration
    update_time = ->
      $('.timer').html $('<h3>').text("#{(end - Date.now()) / 1000} seconds left")
      setTimeout(update_time, 50) if Date.now() <= end

    update_time()

  schedule = (list) ->
    item = list.pop()
    console.log(item.title)

    $('.activity').html($('<h1>')
      .attr('class',item.class)
      .text(item.title)
    )

    timer(minutes(item.time))
    setTimeout(_.bind(schedule, this, list), minutes(item.time))

  schedule(workout)


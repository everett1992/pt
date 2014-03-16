$ ->
  $(document).on 'keypress', (a,b,c) ->
    if a.which == 32 || a.which == 13
      $('#next').click()

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
        'Push-ups'
      ]
    },
    {
      name: 'Abs On Fire'
      each_reps: 10
      sets_per_level: [ 3, 5, 8 ] # Number of sets at level 1, 2, 3
      between_sets: 1          # Minutes between each set
      exercises: [
        'Windshield Wipers',
        'Long Arm Crunches',
        'Reverse Crunches',
        'Bicycle Crunches',
        'Modified V-sits',
        'Heel Touches',
      ]
    }
  ]

  level = 0
  workout_id = parseInt(window.location.hash.split('/').pop(), 10) || 1
  workout = workouts[workout_id - 1]

  # Image file one is a title card, so we need to get the next image
  $('img.exercise').attr("src","assets/images/#{workout_id + 1}.jpg")

  $('.title').append($('<h1>')
    .attr('class', 'name')
    .text(workout.name)
  )


  exercises = _(workout.exercises).map (exercise) ->
    if workout.each_time
      { class: 'exercise', title: exercise, time: workout.each_time }
    else
      { class: 'exercise', title: exercise, reps: workout.each_reps }


  if workout.each_break
    breaks = _(exercises).map (exercise) ->
        { class: 'break', title: 'Break', time: workout.each_break }

    # Set of exercises alternating with breaks.
    set = _.initial(_.flatten(_.zip(exercises, breaks)))
  else
    set = exercises


  # An array of n sets where n is the number of sets at the current level
  sets = _(workout.sets_per_level[0]).times -> set

  interset_breaks = _(sets).map ->
    { class: 'inter_set_break', title: 'Inter Set Break', time: workout.between_sets}

  workout = _.initial(_.flatten(_.zip(sets, interset_breaks))).reverse()

  # Returns minutes to miliseconds
  minutes = (min) -> min * 1000 * 60

  # Adds a countdown timer starting at ms miliseconds
  timer = (ms) ->
    end = Date.now() + ms
    update_time = ->
      $('.timer').html $('<h3>').text("#{(end - Date.now()) / 1000} seconds left")
      setTimeout(update_time, 50) if Date.now() <= end

    update_time()

  # Starts the next exercise
  next = (list) ->
    item = list.pop()
    window.next = _.bind(next, this, list)

    if item.time

      $('.activity').html($('<h1>')
        .attr('class',item.class)
        .text(item.title)
      )

      timer(minutes(item.time))
      setTimeout(window.next, minutes(item.time))
    else if item.reps
      $('.activity').html($('<h1>')
        .attr('class',item.class)
        .text("#{item.title} x #{item.reps}")
      )
      $('.activity').append($('<button>')
        .attr('id', 'next')
        .text('Next')
        .click(window.next)
      )

  next(workout)


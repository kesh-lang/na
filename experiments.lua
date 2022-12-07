list:
	1
	2
	1 + 2
-- [1, 2, 3]

object:
	foo: 1
	bar: 2
-- [foo: 1, bar: 2]

object2:
	foo: 1
	bar: 2
	! log foo + bar  -- outgoing side-effect
-- 3
-- [foo: 1, bar: 2]

nullary:
	foo: 1
	bar: 2
	= foo + bar  -- return a value, explicit
-- #block
result: nullary
-- 3

nullary2:
	foo: a
	bar: b
	foo + bar  -- list item, no implicit return last
-- #block
result: nullary2
-- [0: 3, foo: a, bar: b]

nary(a, b):
	foo: a
	bar: b
	= foo + bar  -- return a value, explicit
-- #function
result: nary(1, 2)
-- 3

actor:
	foo: 1
	bar: 2
	sum: (a, b) -> a + b
	! foo > 1 then [ log sum(foo, bar) ]  -- outgoing side-effect
	>> bump -> [foo: 2]  -- behavior
-- #id
actor bump
-- 4

constractor (init: #number):
	= [sum]
	foo: init
	bar: 2
	sum: (a, b) -> a + b
	! foo > 1 then [ log sum(foo, bar) ]  -- outgoing side-effect
	! foo < 1 then [ self bump ]  -- trigger self-referential side-effect
	>> bump -> [foo: 2]  -- behavior
	-- #function
actor: constractor 2
-- 4
-- #id
actor bump
-- 5
actor.sum(1, 2)
--> 3



counter(from: #number):
	count: from
	squared: count ** 2
	
	>> increase (sender)
		count: _ + 1
		! sender count (count)
	
	>> decrease (sender)
		count: _ - 1
		! sender count (count)
	
	>> count (sender) ! sender count (count)

counter



turtle:
	position: (x: 0, y: 0)
	
	>> turn (direction)
		= direction when
			'right' -> [position.x: _ + 1]
			'left'  -> [position.x: _ - 1]
	
	>> go (direction)
		= direction when
			'forward'  -> [position.y: _ + 1]
			'backward' -> [position.y: _ - 1]

turtle turn 'right'
turtle go 'forward'
turtle turn 'left'
turtle turn 'left'
turtle go 'forward'
turtle turn 'right'

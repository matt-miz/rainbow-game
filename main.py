def on_button_pressed_a():
    global winning_score
    if not (started):
        winning_score = winning_score - 5
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_ab():
    global debug
    debug = not (debug)
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    global winning_score
    if not (started):
        winning_score = winning_score + 5
input.on_button_pressed(Button.B, on_button_pressed_b)

def on_received_value(name, value):
    global acc
    if name == "acc":
        acc = value
radio.on_received_value(on_received_value)

def on_logo_pressed():
    global started
    started = True
input.on_logo_event(TouchButtonEvent.PRESSED, on_logo_pressed)

background_check = False
acc_list: List[number] = []
speed = 0
score = 0
acc = 0
debug = False
winning_score = 0
started = False
max_acc = 0
bouncer = 20
strip_score = neopixel.create(DigitalPin.P1, 150, NeoPixelMode.RGB)
strip_bouncer = neopixel.create(DigitalPin.P2, 150, NeoPixelMode.RGB)
direction = 1
running = True
started = False
radio.set_group(77)
winning_score = 20

def on_forever():
    global running
    if score >= winning_score:
        running = False
        strip_bouncer.show_rainbow(1, 360)
        strip_score.show_rainbow(1, 360)
        basic.show_string("Winner!")
basic.forever(on_forever)

def on_forever2():
    if not (running):
        strip_bouncer.rotate(2)
        strip_score.rotate(-2)
        strip_bouncer.show()
        strip_score.show()
basic.forever(on_forever2)

def on_forever3():
    global speed, bouncer, direction, acc_list, background_check, score
    if running:
        speed = max(2, Math.idiv(score, 10))
        old_bouncer = bouncer
        if started:
            bouncer += direction * speed * 30 / winning_score
        if bouncer >= 150:
            direction = -1
        elif bouncer <= 0:
            direction = 1
        if bouncer <= 10 and old_bouncer > 10 and direction == -1:
            acc_list = [0]
            if debug:
                led.toggle(0, 0)
        elif bouncer < 100 and bouncer > 15 and direction == -1:
            if acc > 2.5:
                background_check = True
                if debug:
                    led.toggle(4, 0)
        elif bouncer >= 10 and old_bouncer < 10 and direction == 1:
            if debug:
                led.toggle(0, 0)
            max_acc2 = 0
            reference_acc = 0
            for i in acc_list:
                max_acc2 = max(max_acc2, i)
            if max_acc2 > 2.5 and not (background_check):
                score = score + 1
            else:
                score = max(score - 1, 0)
                if debug:
                    led.toggle(4, 4)
            background_check = False
        elif bouncer <= 10:
            acc_list.append(acc)
        strip_bouncer.show_bar_graph(bouncer, 150)
basic.forever(on_forever3)

def on_forever4():
    if running:
        strip_score.show_bar_graph(score, winning_score)
        strip_score.show()
basic.forever(on_forever4)

def on_forever5():
    if not (started):
        basic.show_number(winning_score)
basic.forever(on_forever5)

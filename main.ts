input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (!started) {
        winning_score = winning_score - 5
    }
    
})
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    
    debug = !debug
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    if (!started) {
        winning_score = winning_score + 5
    }
    
})
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    
    if (name == "acc") {
        acc = value
    }
    
})
input.onLogoEvent(TouchButtonEvent.Pressed, function on_logo_pressed() {
    
    started = true
})
let background_check = false
let acc_list : number[] = []
let speed = 0
let score = 0
let acc = 0
let debug = false
let winning_score = 0
let started = false
let max_acc = 0
let bouncer = 20
let strip_score = neopixel.create(DigitalPin.P1, 150, NeoPixelMode.RGB)
let strip_bouncer = neopixel.create(DigitalPin.P2, 150, NeoPixelMode.RGB)
let direction = 1
let running = true
started = false
radio.setGroup(77)
winning_score = 20
basic.forever(function on_forever() {
    
    if (score >= winning_score) {
        running = false
        strip_bouncer.showRainbow(1, 360)
        strip_score.showRainbow(1, 360)
        basic.showString("Winner!")
    }
    
})
basic.forever(function on_forever2() {
    if (!running) {
        strip_bouncer.rotate(2)
        strip_score.rotate(-2)
        strip_bouncer.show()
        strip_score.show()
    }
    
})
basic.forever(function on_forever3() {
    let old_bouncer: number;
    let max_acc2: number;
    let reference_acc: number;
    
    if (running) {
        speed = Math.max(2, Math.idiv(score, 10))
        old_bouncer = bouncer
        if (started) {
            bouncer += direction * speed * 30 / winning_score
        }
        
        if (bouncer >= 150) {
            direction = -1
        } else if (bouncer <= 0) {
            direction = 1
        }
        
        if (bouncer <= 10 && old_bouncer > 10 && direction == -1) {
            acc_list = [0]
            if (debug) {
                led.toggle(0, 0)
            }
            
        } else if (bouncer < 100 && bouncer > 15 && direction == -1) {
            if (acc > 2.5) {
                background_check = true
                if (debug) {
                    led.toggle(4, 0)
                }
                
            }
            
        } else if (bouncer >= 10 && old_bouncer < 10 && direction == 1) {
            if (debug) {
                led.toggle(0, 0)
            }
            
            max_acc2 = 0
            reference_acc = 0
            for (let i of acc_list) {
                max_acc2 = Math.max(max_acc2, i)
            }
            if (max_acc2 > 2.5 && !background_check) {
                score = score + 1
            } else {
                score = Math.max(score - 1, 0)
                if (debug) {
                    led.toggle(4, 4)
                }
                
            }
            
            background_check = false
        } else if (bouncer <= 10) {
            acc_list.push(acc)
        }
        
        strip_bouncer.showBarGraph(bouncer, 150)
    }
    
})
basic.forever(function on_forever4() {
    if (running) {
        strip_score.showBarGraph(score, winning_score)
        strip_score.show()
    }
    
})
basic.forever(function on_forever5() {
    if (!started) {
        basic.showNumber(winning_score)
    }
    
})

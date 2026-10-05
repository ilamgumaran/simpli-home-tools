# Owner prompts and next-session handoff

Updated 2026-10-04. This is a curated record of the owner's product prompts and accepted direction, not a complete chat transcript. Quotes retain the original wording. Private device paths, screenshots, local profiles, and operating-system state are excluded.

## Start another session here

Read this file, the [product guide](../PRODUCT.md), [roadmap](../ROADMAP.md), [Time Climber II plan](TIME-CLIMBER-V2-PLAN.md), and [architecture](ARCHITECTURE.md). Planning documents are available on `main`. Working application code is on `add-little-orbit-clock` in [PR #1](https://github.com/ilamgumaran/simpli-home-tools/pull/1), until merged. Check the current branch and PR status before editing; do not assume `main` already contains the executable clock.

Canonical application directory: `tools/little-orbit/`. Product name: **Our Desk Clock**. Preserve the existing Little Orbit paths and portable filename. Four themes exist: Orbit, Candy Quest, Time Climber, and Time Climber II (`climber2`). The last implementation refinement before this handoff is commit `97c5c5f`: mountain digits sit closer together, share a baseline, keep their left-to-right order, and include all four year digits. Local Edge/Chromium and Firefox hosted/portable checks passed. Check Actions for current cross-platform results; physical Android/Vanadium and extended hardware operation remain pending.

Next-session focus requested by the owner: improve the **theme, landscape, and character**. No specific next visual redesign has been selected yet. Use the prompts below as direction, retain readable information and all existing themes, and record new proposals/decisions in Git. Save refinements through branches/PRs; the owner approves merges and releases. No future-session automation is configured.

## Original display direction

> Let’s build a display clock on the browser which shows time and weather with date also and some fun fact daily. Also protect the display make it look retro and cool for the kids. Setup in the rog ally device

> Can you now make it full screen pls and low power mode and also take care of the screen by showing more dark and rearranging to avoid any issues if I leave it running 24x7

> Ok make them glide around a bit or show the facts larger and times smaller once in a while to refresh the screen

> Yes let’s keep all this browse based so it can run on ms edge and chrome and vanadium and Firefox so I can run it on windows mac and Linux pls

> Remove the title or make it tiny so I can see the facts and time and date and weather without scrolling

> Lovely. Can you make the fonts of clock face and weather look bigger also the fact

> Pls make the time don’t twice as big as it is now. Rest look cool

The owner also confirmed touch lock and screen protection. Implementation uses dark styling, layout shifts, dimming, quiet animation, reduced motion and optional black breaks. Browser screen care cannot guarantee prevention of display wear. Size against the actual browser viewport, including OS scaling. Preserve configurable independent font sizes and the no-scrolling requirement.

## Candy companion and theme collection

> Lovely this looks very good. Seems like we can do something to take care of the screen from pixel burns. Can you pls make it more like screen saver which is little fun and platform game like moving a little now and then like a cartoon character like a candy drop shaped char chasing the time or riding a bike or running or doing some work on the screen gaps between the time and weather and the facts. Let’s keep this format as one theme and make this as a new theme and give simple option to cycle through themes so we can add a bit more

Accepted direction: original characters, short playful visits, quiet intervals, safe gaps around text, and a simple Theme cycle. New themes supplement existing choices.

## Collaboration and configuration

> Also I made a repo that I want to share with my friends and others. Picks safe open source licenses and create a dir for this tool keep it updated here pls https://github.com/ilamgumaran/simpli-home-tools
>
> This way we can enhance it together with others and they can contribute too.
>
> Pls keep it configurable so it can be easily tweaked for the display size of the device and browse and OS etc.

The initial open-source licensing request was later superseded by the commercial-permission request below. Keep the runtime browser-only, portable, responsive, and independent of optional device launchers. Use feature detection instead of browser/OS-name branching. Do not publish machine-specific settings or power state.

## Time Climber I

> Pls make the char climb the widgets we have in our clock. We should call this our desk clock. Give our chat stick appendages so it can climb etc. make it look like it has a mountaineer backpack and rope and decided to climb the widgets be clock numbers and relax on them and go and collect food or water or other items and let the clock number change as the that climbs the numbers so it’s like we are seeing this through a window which is our screen and our char is climbing the mountain of time and as it climbs up the time changes and our char rests does something fun builds a tent and also like the new pc climbing game has a tent suspended on a side of a mountain in the middle of the climb. Let it swing ropes to attract to time numbers to climb. Let’s build this as time climber

Accepted direction: stick limbs, mountaineering backpack, ropes and anchors, widget/digit climbing, supplies, rest, and a suspended campsite. The game comparison describes an experience; keep all artwork original rather than copying game assets.

## Time Climber II — Mountain of Time

> Another idea. Let’s along the hours on top and minute at the bottom and may the the date (day) all the way on top.
>
> And month further into horizon and year also further into horizon so it looks like our monitineeer is climbing one digit at a time crossing the minute easily and taking an appropriate time to climb hours and then the day etc. this could be challenging but let’s trying making the current number the character climb larger and other small until the character finish one number then let the other number feel large like we are zooming into that one and this should match the the movement of time like minutes moving up to hours and day like the. Let’s make a new char that is tiny but visible. It should be like seeing the character though lens. Let’s call it a second version of climber of time and may be make the char part of a mountain that looks like the number and trails that walk that resemble numbers or roads that resemble numbers so the perspective moved from top view then side view then the other side view like climbing the mountain then walking the mountiain trail then climbing to next level and Perspective changing and following the character but for the viewer they should get rhe full time and day and month char all the time. Let’s plan for this and execute this later this week. So prepare for this plan and design out but don’t execute yet.

> Save the plan in git and let’s organize to evolve this into a full fledged product so keep saving all this in git

> Pls proceed with implementation

The last prompt explicitly authorized implementation, superseding the earlier deferral. The initial implementation is now on the development branch. Preserve the [original plan and design study](README.md); they communicate the intended richer landscape even where the initial runtime is simpler.

Accepted direction: a tiny visible original explorer viewed through a gentle lens; numeral-shaped mountains/roads/trails; minute foreground, hours above, day summit, distant month/year; focused digit enlargement; top/side/opposite-side views; faster minute trips and calendar-paced higher journeys. Always keep full time/date, weather, and facts readable outside the camera. Time comes from the device clock, never from animation completion.

## Latest readability correction

> Ok the numbers need to be bit closer so they read like time and clock.

Implemented in `97c5c5f`. Preserve recognizable grouped numbers during future landscape and perspective work. A larger active numeral must not reverse the pair or scatter the other digits.

## Current licensing direction

> Also update the license such that no one can use this to make money until they get permission from us

Current versions use **Simpli Home Tools Noncommercial License 1.0**. Commercial use or monetization requires separate written permission from ilamgumaran. This is source-available, not OSI open source. Previously granted GPL rights remain in effect. Read the [license](../LICENSE) and [licensing guide](../../../LICENSING.md); keep original artwork and contributor attribution.

## Keep this handoff on main

> Also pls keep the plans in the main and the overall prompts as I may have another session to improve the theme, landscape and character

Keep this curated record and the planning hub on `main`; update them as the owner changes direction. Clearly distinguish proposals, branch implementations, verification results, and released features. Do not interpret archived prompts as authorization for unrelated deployments or scheduled work.

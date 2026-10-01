export interface Emoji {
  char: string
  name: string
}

export interface EmojiCategory {
  id: string
  label: string
  icon: string
  emojis: Emoji[]
}

// "char name[,alias]" pairs, space separated rows keep this file compact
const RAW: [id: string, label: string, icon: string, data: string][] = [
  [
    'people',
    'People',
    '😀',
    `😀 grinning|😃 smiley|😄 smile|😁 grin|😆 laughing,satisfied|😅 sweat_smile|🤣 rofl|😂 joy|🙂 slight_smile|🙃 upside_down|😉 wink|😊 blush|😇 innocent|🥰 smiling_face_with_hearts|😍 heart_eyes|🤩 star_struck|😘 kissing_heart|😋 yum|😛 stuck_out_tongue|😜 stuck_out_tongue_winking_eye|🤪 zany_face|🤑 money_mouth|🤗 hugging|🤭 hand_over_mouth|🤫 shushing_face|🤔 thinking|🤐 zipper_mouth|🤨 raised_eyebrow|😐 neutral_face|😑 expressionless|😶 no_mouth|😏 smirk|😒 unamused|🙄 rolling_eyes|😬 grimacing|😌 relieved|😔 pensive|😪 sleepy|😴 sleeping|😷 mask|🤒 thermometer_face|🤢 nauseated_face|🤮 vomiting|🥵 hot_face|🥶 cold_face|🥴 woozy_face|😵 dizzy_face|🤯 exploding_head|🤠 cowboy|🥳 partying_face|😎 sunglasses|🤓 nerd|🧐 monocle|😕 confused|😟 worried|🙁 slight_frown|😮 open_mouth|😲 astonished|😳 flushed|🥺 pleading_face|😦 frowning|😧 anguished|😨 fearful|😰 cold_sweat|😥 disappointed_relieved|😢 cry|😭 sob|😱 scream|😖 confounded|😣 persevere|😞 disappointed|😓 sweat|😩 weary|😫 tired_face|🥱 yawning_face|😤 triumph|😡 rage|😠 angry|🤬 cursing|😈 smiling_imp|💀 skull|💩 poop|🤡 clown|👻 ghost|👽 alien|🤖 robot|👋 wave|🤚 raised_back_of_hand|✋ raised_hand|🖖 vulcan|👌 ok_hand|🤌 pinched_fingers|✌️ v|🤞 fingers_crossed|🤟 love_you_gesture|🤘 metal|🤙 call_me|👈 point_left|👉 point_right|👆 point_up_2|👇 point_down|👍 thumbsup,+1|👎 thumbsdown,-1|✊ fist|👊 punch|👏 clap|🙌 raised_hands|👐 open_hands|🤝 handshake|🙏 pray|💪 muscle|🧠 brain|👀 eyes|👁️ eye|🫡 saluting_face|🫠 melting_face`,
  ],
  [
    'nature',
    'Nature',
    '🌵',
    `🐶 dog|🐱 cat|🐭 mouse|🐹 hamster|🐰 rabbit|🦊 fox|🐻 bear|🐼 panda|🐨 koala|🐯 tiger|🦁 lion|🐮 cow|🐷 pig|🐸 frog|🐵 monkey|🐔 chicken|🐧 penguin|🐦 bird|🦆 duck|🦅 eagle|🦉 owl|🦇 bat|🐺 wolf|🐴 horse|🦄 unicorn|🐝 bee|🐛 bug|🦋 butterfly|🐌 snail|🐞 ladybug|🐢 turtle|🐍 snake|🦖 t_rex|🐙 octopus|🦀 crab|🐬 dolphin|🐳 whale|🦈 shark|🌵 cactus|🎄 christmas_tree|🌲 evergreen_tree|🌴 palm_tree|🌱 seedling|🌿 herb|🍀 four_leaf_clover|🍁 maple_leaf|🍄 mushroom|🌷 tulip|🌹 rose|🌻 sunflower|🌸 cherry_blossom|🌞 sun_with_face|🌝 full_moon_with_face|🌙 crescent_moon|⭐ star|🌟 star2|✨ sparkles|⚡ zap|🔥 fire|🌈 rainbow|☀️ sunny|⛅ partly_sunny|☁️ cloud|❄️ snowflake|☃️ snowman|🌊 ocean`,
  ],
  [
    'food',
    'Food',
    '🍕',
    `🍏 green_apple|🍎 apple|🍐 pear|🍊 tangerine|🍋 lemon|🍌 banana|🍉 watermelon|🍇 grapes|🍓 strawberry|🫐 blueberries|🍒 cherries|🍑 peach|🥭 mango|🍍 pineapple|🥥 coconut|🥝 kiwi|🍅 tomato|🥑 avocado|🍆 eggplant|🥕 carrot|🌽 corn|🌶️ hot_pepper|🥐 croissant|🍞 bread|🧀 cheese|🥚 egg|🍳 cooking|🥞 pancakes|🥓 bacon|🍗 poultry_leg|🍖 meat_on_bone|🌭 hotdog|🍔 hamburger|🍟 fries|🍕 pizza|🌮 taco|🌯 burrito|🥗 salad|🍝 spaghetti|🍜 ramen|🍣 sushi|🍱 bento|🍤 fried_shrimp|🍩 doughnut|🍪 cookie|🎂 birthday|🍰 cake|🧁 cupcake|🍫 chocolate_bar|🍬 candy|🍭 lollipop|🍿 popcorn|☕ coffee|🍵 tea|🧋 bubble_tea|🥤 cup_with_straw|🍺 beer|🍻 beers|🍷 wine_glass|🍸 cocktail|🍾 champagne`,
  ],
  [
    'activities',
    'Activities',
    '⚽',
    `⚽ soccer|🏀 basketball|🏈 football|⚾ baseball|🎾 tennis|🏐 volleyball|🏉 rugby_football|🎱 8ball|🏓 ping_pong|🏸 badminton|🏒 hockey|⛳ golf|🏹 bow_and_arrow|🎣 fishing_pole_and_fish|🥊 boxing_glove|🛹 skateboard|⛸️ ice_skate|🎿 ski|🏆 trophy|🥇 first_place|🥈 second_place|🥉 third_place|🏅 medal|🎖️ military_medal|🎗️ reminder_ribbon|🎫 ticket|🎪 circus_tent|🎭 performing_arts|🎨 art|🎬 clapper|🎤 microphone|🎧 headphones|🎼 musical_score|🎹 musical_keyboard|🥁 drum|🎷 saxophone|🎺 trumpet|🎸 guitar|🎻 violin|🎲 game_die|♟️ chess_pawn|🎯 dart|🎳 bowling|🎮 video_game|🕹️ joystick|🧩 jigsaw`,
  ],
  [
    'travel',
    'Travel',
    '🚀',
    `🚗 red_car|🚕 taxi|🚙 blue_car|🚌 bus|🏎️ race_car|🚓 police_car|🚑 ambulance|🚒 fire_engine|🚚 truck|🚲 bike|🛵 motor_scooter|🏍️ motorcycle|🚨 rotating_light|🚄 bullettrain_side|✈️ airplane|🚁 helicopter|🚀 rocket|🛸 flying_saucer|🛶 canoe|⛵ sailboat|🚢 ship|⚓ anchor|🗽 statue_of_liberty|🗼 tokyo_tower|🏰 european_castle|🎡 ferris_wheel|🎢 roller_coaster|⛲ fountain|🏖️ beach|🏝️ island|🌋 volcano|⛰️ mountain|🏕️ camping|🏠 house|🏢 office|🏥 hospital|🏦 bank|🌆 city_sunset|🌃 night_with_stars|🌌 milky_way|🌍 earth_africa|🌎 earth_americas|🗺️ map`,
  ],
  [
    'objects',
    'Objects',
    '💡',
    `⌚ watch|📱 iphone|💻 computer|⌨️ keyboard|🖥️ desktop|🖨️ printer|🖱️ mouse_three_button|💾 floppy_disk|💿 cd|📷 camera|📹 video_camera|📺 tv|📻 radio|⏰ alarm_clock|⌛ hourglass|🔋 battery|🔌 electric_plug|💡 bulb|🔦 flashlight|🕯️ candle|💸 money_with_wings|💵 dollar|💰 moneybag|💳 credit_card|💎 gem|🔧 wrench|🔨 hammer|🛠️ tools|⚙️ gear|🔫 gun|💣 bomb|🔪 knife|🛡️ shield|🔮 crystal_ball|💊 pill|🧪 test_tube|🔬 microscope|🔭 telescope|🧹 broom|🎁 gift|🎈 balloon|🎉 tada|🎊 confetti_ball|✉️ envelope|📦 package|📝 memo|📌 pushpin|📎 paperclip|✂️ scissors|🔒 lock|🔑 key|🧲 magnet|📚 books|📖 book|🔔 bell|📣 mega|📢 loudspeaker`,
  ],
  [
    'symbols',
    'Symbols',
    '❤️',
    `❤️ heart|🧡 orange_heart|💛 yellow_heart|💚 green_heart|💙 blue_heart|💜 purple_heart|🖤 black_heart|🤍 white_heart|🤎 brown_heart|💔 broken_heart|❣️ heart_exclamation|💕 two_hearts|💞 revolving_hearts|💓 heartbeat|💗 heartpulse|💖 sparkling_heart|💘 cupid|💝 gift_heart|💯 100|💢 anger|💥 boom|💫 dizzy|💦 sweat_drops|💨 dash|💬 speech_balloon|💭 thought_balloon|💤 zzz|✅ white_check_mark|☑️ ballot_box_with_check|✔️ heavy_check_mark|❌ x|❎ negative_squared_cross_mark|➕ heavy_plus_sign|➖ heavy_minus_sign|➗ heavy_division_sign|❓ question|❗ exclamation|‼️ bangbang|⁉️ interrobang|⚠️ warning|🚫 no_entry_sign|⛔ no_entry|♻️ recycle|🔴 red_circle|🟠 orange_circle|🟡 yellow_circle|🟢 green_circle|🔵 blue_circle|🟣 purple_circle|⚫ black_circle|⚪ white_circle|🆗 ok|🆒 cool|🆕 new|🆓 free|🔝 top|🔜 soon|▶️ arrow_forward|⏸️ pause_button|🔁 repeat|🎵 musical_note|🎶 notes`,
  ],
]

export const EMOJI_CATEGORIES: EmojiCategory[] = RAW.map(([id, label, icon, data]) => ({
  id,
  label,
  icon,
  emojis: data.split('|').map(entry => {
    const space = entry.indexOf(' ')
    return { char: entry.slice(0, space), name: entry.slice(space + 1) }
  }),
}))

export const ALL_EMOJIS = EMOJI_CATEGORIES.flatMap(c => c.emojis)

const BY_SHORTCODE = new Map(
  ALL_EMOJIS.flatMap(e => e.name.split(',').map(alias => [alias, e.char] as const))
)

/** ":fire: nice" -> "🔥 nice" */
export const replaceShortcodes = (text: string) =>
  // Skip custom emoji tokens like <:fire:e-123>
  text.replace(/(?<!<):([a-z0-9_+-]+):(?![\w-]*>)/g, (match, code: string) => BY_SHORTCODE.get(code) ?? match)

export const searchEmojis = (query: string) => {
  const q = query.toLowerCase().replace(/^:/, '')
  return ALL_EMOJIS.filter(e => e.name.includes(q))
}

export const emojiName = (char: string) =>
  ALL_EMOJIS.find(e => e.char === char)?.name.split(',')[0] ?? 'emoji'

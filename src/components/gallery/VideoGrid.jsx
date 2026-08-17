/**
 * ================================================================
 * VideoGrid.jsx
 * ================================================================
 * "Behind the Repairs" -- a compact, interactive video showcase.
 *
 * LAYOUT
 * A small 3D "reel" of clips sits on the left, a bigger player sits
 * on the right (stacks player-on-top on small screens). Both are
 * kept short on purpose -- this is a supporting section, not the
 * page's hero, so it should never dominate the screen.
 *
 * THE 3D REEL -- HOW IT WORKS
 * The 4 clips on the left sit on an endless rolling drum, not a
 * scrollable list: every frame, a single shared number ("raw",
 * `wrappedOffset` below) ticks upward and wraps back to 0 once it
 * passes the drum's full height. Each card reads its own position
 * off that shared number, so all 4 move together as one continuous
 * loop. The closer a card is to dead-center, the flatter/bigger/more
 * opaque it is; the further it drifts toward the top or bottom edge,
 * the more it tilts back (rotateX), shrinks and fades -- exactly
 * like the front curve of a rotating drum.
 *
 * That same shared number can also be pushed by the visitor: mouse
 * wheel / trackpad scroll and touch-drag over the reel both nudge it
 * directly (see onWheel/onPan below), so the drum can be spun by
 * hand in either direction -- the automatic roll keeps adding to it
 * in the background regardless, so it always settles back into its
 * slow drift once the visitor lets go.
 *
 * Every card is also a LIVE preview -- the real clip playing muted
 * and looped, not a static thumbnail image -- with a small light tag
 * naming the clip, and (only on whichever one is currently loaded in
 * the big player) a small green "Playing" badge in the corner. The
 * active card's border highlight is grey, not red, so it reads as
 * "currently selected" rather than a call-to-action colour.
 *
 * SWAPPING THE BIG PLAYER
 * Clicking any card sets it as the active clip; the big player
 * crossfades from whatever was playing to the new one.
 *
 * SOUND
 * Everything is muted by default (autoplaying media with sound is
 * blocked by browsers anyway, and 4 clips playing sound at once
 * would be unusable) -- the big player keeps its native `controls`
 * bar so the visitor can turn sound on themselves.
 * ================================================================
 */
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from "motion/react";
import { FaPlay } from "react-icons/fa6";
import Container from "../layout/Container";
import { galleryVideos } from "../../data/galleryVideos";

// Real pixel values the 3D math below is written against. They also
// have to match the literal Tailwind classes used on the elements
// (h-56 = 224px, h-14 = 56px) -- kept as named constants purely so
// the math reads clearly, NOT used to generate class names (Tailwind
// can't see dynamically-built class strings, so the JSX below always
// spells out the matching class literally).
const REEL_HEIGHT = 224; // px, matches the `h-56` classes further down
const CARD_HEIGHT = 56; // px, matches the `h-14` card classes, and also doubles as the spacing between cards on the drum
const ROLL_SPEED = 22; // px of automatic drum travel per second
const WHEEL_SENSITIVITY = 0.5; // how far one wheel "notch" spins the drum

/**
 * Works out where card `index` currently sits on the drum, as a
 * pixel offset from dead-center (negative = above center, positive
 * = below). `raw` is the shared, ever-increasing scroll value --
 * wrapping it with `% totalHeight` is what turns a straight line of
 * numbers into an endless loop.
 */
function wrappedOffset(index, count, raw) {
  const totalHeight = count * CARD_HEIGHT;
  let pos = (index * CARD_HEIGHT - raw) % totalHeight;
  if (pos < -totalHeight / 2) pos += totalHeight;
  if (pos > totalHeight / 2) pos -= totalHeight;
  return pos;
}

/** One card on the drum -- position, tilt, scale and fade are all
 * derived from the shared `raw` motion value passed down from
 * VideoGrid, so this card never needs its own animation loop. */
function ReelCard({ video, index, count, raw, isActive, onSelect }) {
  const y = useTransform(raw, (v) => wrappedOffset(index, count, v));
  // Cards above center tilt one way, cards below tilt the other --
  // this is the actual "rolling drum" illusion.
  const rotateX = useTransform(y, (v) => (v / (REEL_HEIGHT / 2)) * -35);
  const scale = useTransform(
    y,
    (v) => 1 - Math.min(Math.abs(v) / (REEL_HEIGHT / 2), 1) * 0.25,
  );
  const opacity = useTransform(
    y,
    (v) => 1 - Math.min(Math.abs(v) / (REEL_HEIGHT / 2), 1) * 0.75,
  );

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      style={{ y, rotateX, scale, opacity }}
      className={`absolute inset-x-0 top-1/2 -mt-7 h-14 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
        isActive
          ? "border-neutral"
          : "border-tertiary/20 hover:border-tertiary/50"
      }`}
    >
      {/* Live, silent, looping preview -- this IS the clip, not a
          static thumbnail image. */}
      <video
        src={video.videoUrl}
        muted
        loop
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      <span
        className={`absolute inset-0 ${isActive ? "bg-background/50" : "bg-background/25"}`}
      />

      {/* Small, light "which clip is this" tag. */}
      <span className="absolute top-1 left-1 max-w-[70%] px-1.5 py-0.5 rounded bg-white/15 backdrop-blur-sm">
        <span className="font-label text-[7px] uppercase tracking-wider text-white truncate block">
          {video.title}
        </span>
      </span>

      {/* Small green "Playing" badge, corner -- only on whichever
          card is currently loaded in the big player. */}
      {isActive && (
        <span className="absolute top-1 right-1 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-success">
          <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
          <span className="font-label text-[7px] uppercase tracking-wider text-white">
            Playing
          </span>
        </span>
      )}

      {/* Plain play icon on the rest, so it still reads as
          clickable. */}
      {!isActive && (
        <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-background/70 flex items-center justify-center">
          <FaPlay className="text-white text-[7px] ml-0.5" />
        </span>
      )}
    </motion.button>
  );
}

export default function VideoGrid() {
  // Which video (by id) is currently loaded in the big player.
  // Defaults to the first one, so something is already playing the
  // moment the section appears.
  const [activeId, setActiveId] = useState(galleryVideos[0].id);
  const activeVideo = galleryVideos.find((video) => video.id === activeId);

  // The single shared value every card's position is derived from
  // (see wrappedOffset). Ticked forward every animation frame as a
  // plain number, never through React state, so the drum rolling
  // forever never triggers a re-render. Wheel/drag input (below)
  // pushes this exact same value, so hand input and the automatic
  // roll blend together seamlessly.
  const raw = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    raw.set(raw.get() + (ROLL_SPEED * delta) / 1000);
  });

  // Mouse wheel / trackpad scroll over the reel spins the drum by
  // hand -- scrolling "down" rolls it the same direction as the
  // automatic drift, scrolling "up" reverses it.
  const handleWheel = (event) => {
    event.preventDefault();
    raw.set(raw.get() + event.deltaY * WHEEL_SENSITIVITY);
  };

  // Touch/mouse drag does the same thing, but content follows the
  // finger directly: dragging upward spins the drum forward.
  const handlePan = (_, info) => {
    raw.set(raw.get() - info.delta.y);
  };

  return (
    <section className="py-14 lg:py-16">
      <Container>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center mb-10">
          Behind the Repairs
        </h2>

        {/* max-w-3xl keeps the whole block compact and centered,
            rather than stretching full-width like a hero section. */}
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center md:items-stretch justify-center gap-4 md:gap-8 px-2 sm:px-6">
          {/* ------------------------------------------------------
              3D ROLLING REEL -- wheel + drag both spin it by hand
             ------------------------------------------------------ */}
          <div className="w-36 sm:w-40 md:w-40 mx-auto md:mx-0 shrink-0">
            <motion.div
              onWheel={handleWheel}
              onPan={handlePan}
              className="relative w-full h-56 overflow-hidden rounded-lg touch-none cursor-grab active:cursor-grabbing perspective-[900px]"
            >
              <div className="absolute inset-0 transform-3d">
                {galleryVideos.map((video, index) => (
                  <ReelCard
                    key={video.id}
                    video={video}
                    index={index}
                    count={galleryVideos.length}
                    raw={raw}
                    isActive={video.id === activeId}
                    onSelect={() => setActiveId(video.id)}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* ------------------------------------------------------
              BIG PLAYER
             ------------------------------------------------------ */}
          <div className="shrink-0">
            <div className="relative md:w-72 lg:w-122 h-56 rounded-xl overflow-hidden bg-secondary border border-tertiary/20">
              {/* AnimatePresence crossfades the outgoing clip out and
                  the newly picked one in, instead of a hard jump-cut
                  the instant `activeId` changes. */}
              <AnimatePresence mode="wait">
                <motion.video
                  key={activeVideo.id}
                  src={activeVideo.videoUrl}
                  muted
                  autoPlay
                  loop
                  playsInline
                  controls
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * ================================================================
 * WorkshopVideoSection.jsx
 * ================================================================
 * "Step Inside Our Workshop" banner section.
 *
 * Shows the real workshop photo as a background with a centered
 * play button. Once the button is clicked, the static photo is
 * replaced with an actual <video> element that plays the real
 * workshop-tour.mp4 file inline.
 * ================================================================
 */
import { useState } from "react";
import { FaPlay } from "react-icons/fa6";
import Container from "../layout/Container";
import workshopBg from "../../assets/images/workshop/workshop-bg.jpg";
import { workshopTourVideoUrl } from "../../data/galleryVideos";

export default function WorkshopVideoSection() {
  // Tracks whether the user has clicked play. Once true, we swap the
  // static background image out for the actual <video> player.
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    // Reduced vertical spacing (was py-16 lg:py-20) so the section
    // takes up less room on the page overall, on top of the shorter
    // banner height set below.
    <section className="py-10 lg:py-14">
      <Container>
        {/*
          Banner height is now controlled with explicit responsive
          heights instead of an aspect-ratio. aspect-[21/9] made the
          box scale up (and get taller) on wide screens, which is
          what was causing the "too tall" banner. Fixed heights per
          breakpoint keep it compact and fully predictable on every
          screen size, from small phones up to large desktops.
        */}
        <div className="relative rounded-2xl overflow-hidden h-55 sm:h-65 md:h-75 lg:h-85 bg-secondary border border-tertiary/20 flex flex-col items-center justify-center gap-4 sm:gap-6">
          {isPlaying ? (
            // ---------------- VIDEO PLAYER (shown after clicking play) ----------------
            <video
              src={workshopTourVideoUrl}
              controls // shows the browser's native play/pause/volume/fullscreen bar
              autoPlay
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
              {/* ---------------- STATIC BACKGROUND PHOTO (before play is clicked) ---------------- */}
              <img
                src={workshopBg}
                alt="Amal Car's Doctor workshop interior"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/*
                Uniform dark tint across the ENTIRE photo.
                The previous version only had a gradient that was dark
                at the bottom and transparent at the top, so wherever
                the text/button landed over a bright part of the photo
                (the white ceiling lights in this image), the white
                heading text had almost no contrast and disappeared.
                A flat, even dark layer over the whole image guarantees
                the white text stays readable no matter which part of
                the photo it happens to sit on top of.
              */}
              <div className="absolute inset-0 bg-background/60" />

              {/* Extra gradient on top of the flat tint, purely to add
                  depth and keep the very bottom edge a touch darker. */}
              <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />

              <div className="relative z-10 text-center px-4">
                {/*
                  drop-shadow adds a soft dark halo directly around the
                  letters themselves, as a second layer of protection
                  on top of the dark overlay above, so the heading stays
                  legible even on brighter patches of the photo.
                  Font sizes are also scaled down for the shorter banner
                  height, and scale back up on larger screens.
                */}
                <h3 className="font-heading font-bold text-white text-base sm:text-lg md:text-xl mb-1 sm:mb-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                  Step Inside Our Workshop
                </h3>
                <p className="text-neutral text-xs sm:text-sm max-w-md mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                  Experience the precision of Riyadh's most advanced service
                  center.
                </p>
              </div>

              {/* Play button also scales down slightly on small screens
                  to match the shorter banner height. */}
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center hover:scale-110 transition-all duration-200 shadow-[0_0_30px_-5px_var(--color-primary)]"
                aria-label="Play workshop video"
              >
                <FaPlay className="text-white text-base sm:text-lg ml-1" />
              </button>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}

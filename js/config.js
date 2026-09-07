/**
 * HawkieTime.com — single source of truth for game details.
 *
 * Edit the values below to update the countdown. Nothing else in the
 * codebase needs to change.
 *
 * IMPORTANT — timezone handling:
 * `kickoffISO` MUST include an explicit UTC offset (e.g. "+10:00" for
 * AEST, "+11:00" for AEDT). With an explicit offset, every visitor's
 * browser computes the same remaining time regardless of their own
 * local timezone. Do NOT remove the offset.
 *
 * AFL finals in September are before daylight saving starts (first
 * Sunday in October), so Victoria/Tasmania venues are AEST (+10:00).
 * Double-check the offset if the venue is in a different state or if
 * daylight saving is active by kickoff.
 */
const HAWKIE_CONFIG = {
  // TODO: confirm/replace once the opponent is known. While `confirmed`
  // is false, the page shows a "TBC" graphic badge instead of `name`.
  // Flip `confirmed` to true and set `name` once the opponent is set —
  // no other file needs to change.
  opponent: {
    name: "To be confirmed",
    confirmed: false,
  },
  round: "Preliminary Final",
  venue: "MCG",

  // ISO 8601 datetime WITH UTC offset. Date is still a placeholder —
  // confirm once the fixture is locked in. Kickoff time/venue confirmed.
  kickoffISO: "2026-09-19T19:40:00+10:00",

  // Human-readable strings shown under the countdown (kept separate
  // from kickoffISO so display formatting can differ from the ISO value).
  displayDate: "Saturday 19 September 2026",
  displayKickoff: "7:40 PM AEST (Melbourne)",

  // Shown once the countdown reaches zero. Safe to edit any time.
  postCountdownHeadline: "IT'S HAWKIE TIME.",
  postCountdownSubtext: "Go Hawks.",
};

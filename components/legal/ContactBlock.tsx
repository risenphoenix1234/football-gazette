// components/legal/ContactBlock.tsx

const SOCIALS = [
  { label: "Instagram", handle: "@Footballgazettehq", href: "https://instagram.com/Footballgazettehq" },
  { label: "YouTube", handle: "@FootballGazette", href: "https://youtube.com/@FootballGazette" },
  { label: "TikTok", handle: "@FootballGazette", href: "https://tiktok.com/@FootballGazette" },
  { label: "Facebook", handle: "Football Gazette", href: "https://facebook.com/FootballGazette" },
  { label: "X", handle: "FootballGazett1", href: "https://x.com/FootballGazett1" },
];

export default function ContactBlock() {
  return (
    <div className="mt-10 border-t border-gray-200 pt-8 sm:mt-14 sm:pt-10">
      <p className="text-sm font-bold uppercase tracking-wide text-gray-400 sm:text-base">
        Get in touch
      </p>
      
        <a href="mailto:Footballgazette23@gmail.com"
        className="mt-1 inline-block text-base font-black text-purple-700 hover:underline sm:text-lg"
      >
        Footballgazette23@gmail.com
      </a>

      <p className="mt-6 text-sm font-bold uppercase tracking-wide text-gray-400 sm:text-base">
        Follow us
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm sm:text-base">
        {SOCIALS.map((s) => (
          <li key={s.label}>
              
            <a href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-black hover:text-purple-700"
            >
              {s.label}:{" "}
              <span className="font-semibold text-gray-600">{s.handle}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
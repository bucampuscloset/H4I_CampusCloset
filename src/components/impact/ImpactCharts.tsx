interface Impact {
  itemsReused: number;
  itemsDonated: number;
  attendance: number;
  wasteDivertedKg: number;
  waterSavedL: number;
  carbonSavedKg: number;
}

const KG_TO_LBS = 2.20462
const LBS_PER_SUITCASE = 40
const LITERS_PER_PERSON_PER_YEAR = 1000
const LBS_CO2_PER_TREE_PER_YEAR = 48

export default function ImpactCharts({ impact }: { impact: Impact }) {
  const wasteLbs = Math.round((impact.wasteDivertedKg || 0) * KG_TO_LBS);
  const waterLiters = Math.round(impact.waterSavedL || 0);
  const carbonLbs = Math.round((impact.carbonSavedKg || 0) * KG_TO_LBS);

  const roundToTwoSigFigs = (num: number) => Number(num.toPrecision(2));

  const rawSuitcases = wasteLbs / LBS_PER_SUITCASE;
  const rawWaterYears = waterLiters / LITERS_PER_PERSON_PER_YEAR;
  const rawTrees = carbonLbs / LBS_CO2_PER_TREE_PER_YEAR;


  const normalize = (raw: number) => (raw <= 0 ? 0 : Math.max(1, roundToTwoSigFigs(raw)));
  const suitcases = normalize(rawSuitcases);
  const waterYears = normalize(rawWaterYears);
  const trees = normalize(rawTrees);

  return (
    <div className="w-full py-12 bg-transparent">
      <div className="max-w-5xl mx-auto">

        {/* --- EQUIVALENCY SECTION --- */}
        <div className="pt-8 border-t border-gray-200 font-body">
          
          <h3 className="text-3xl mb-10 text-center text-brand-text">
            What does that look like?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Waste Equivalency */}
            <div className="bg-brand-stat-terra p-8 rounded-2xl border-2 border-black shadow-sm flex flex-col items-center text-center">
              <div className="text-5xl mb-4" aria-hidden="true">🎒</div>
              <h4 className="text-xl font-body font-extrabold mb-3 text-brand-text">{wasteLbs.toLocaleString()} lbs of waste</h4>
              <p className="text-brand-text/70 leading-relaxed text-sm">
                Equivalent to the weight of <span className="font-body font-extrabold text-black">{suitcases.toLocaleString()}+ fully packed suitcases</span> kept out of landfills.
              </p>
            </div>

            {/* Water Equivalency */}
            <div className="bg-brand-faq-active p-8 rounded-2xl border-2 border-black shadow-sm flex flex-col items-center text-center">
              <div className="text-5xl mb-4" aria-hidden="true">💧</div>
              <h4 className="text-xl font-body font-extrabold mb-3 text-brand-text">{waterLiters.toLocaleString()} liters of water</h4>
              <p className="text-brand-text/70 leading-relaxed text-sm">
                Enough drinking water to sustain <span className="font-body font-extrabold text-black">{waterYears.toLocaleString()}+ people</span> for an entire year.
              </p>
            </div>

            {/* Carbon Equivalency */}
            <div className="bg-brand-stat-green p-8 rounded-2xl border-2 border-black shadow-sm flex flex-col items-center text-center">
              <div className="text-5xl mb-4" aria-hidden="true">🌱</div>
              <h4 className="text-xl font-body font-extrabold mb-3 text-brand-text">{carbonLbs.toLocaleString()} lbs of CO₂</h4>
              <p className="text-brand-text/70 leading-relaxed text-sm">
                Equivalent to the carbon absorbed by planting <span className="font-body font-extrabold text-black">{trees.toLocaleString()}+ trees</span>.
              </p>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}

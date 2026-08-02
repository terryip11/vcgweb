const stats = [
  { value: "70+", label: "合作金融機構" },
  { value: "24hr", label: "最快回覆時間" },
  { value: "90%*", label: "過往平均獲批率" },
  { value: "24×7", label: "專人跟進服務" },
];

export default function TrustStats() {
  return (
    <section className="bg-[#0c2340] py-14 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center text-2xl font-bold">為何選擇 VCG？</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-amber-300 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-blue-200">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-blue-300">
          * 過往客戶數據，實際以金融機構審批為準
        </p>
      </div>
    </section>
  );
}

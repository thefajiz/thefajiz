import { Layout } from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl md:text-6xl text-gold mb-12">
          terms of use
        </h1>
        <div className="space-y-8 text-sm md:text-base leading-relaxed text-ivory/80">
          <section>
            <h2 className="text-xl text-gold mb-4 font-serif">1. acceptance of terms</h2>
            <p>
              by accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl text-gold mb-4 font-serif">2. intellectual property</h2>
            <p>
              all content on this website, including text, graphics, logos, images, and software, is the property of muhammad fajis and is protected by international copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-gold mb-4 font-serif">3. use license</h2>
            <p>
              permission is granted to temporarily download one copy of the materials on this website for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-gold mb-4 font-serif">4. limitations</h2>
            <p>
              in no event shall we be liable for any damages arising out of the use or inability to use the materials on this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-gold mb-4 font-serif">5. revisions and errata</h2>
            <p>
              the materials appearing on this website could include technical, typographical, or photographic errors. we do not warrant that any of the materials are accurate, complete, or current.
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
}

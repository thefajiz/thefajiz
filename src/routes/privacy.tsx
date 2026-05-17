import { Layout } from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl md:text-6xl text-gold mb-12">
          privacy policy
        </h1>
        <div className="space-y-8 text-sm md:text-base leading-relaxed text-ivory/80">
          <section>
            <h2 className="text-xl text-gold mb-4 font-serif">1. information we collect</h2>
            <p>
              we do not collect any personal data automatically. any information you provide through contact forms or email is used solely to respond to your inquiries.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl text-gold mb-4 font-serif">2. use of information</h2>
            <p>
              your information is never shared with third parties, sold, or used for marketing purposes without your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-gold mb-4 font-serif">3. cookies and tracking</h2>
            <p>
              this website may use essential cookies to ensure basic functionality. we do not use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-gold mb-4 font-serif">4. third-party links</h2>
            <p>
              our site may contain links to external sites that are not operated by us. we have no control over the content and practices of these sites and cannot accept responsibility for their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-gold mb-4 font-serif">5. changes to this policy</h2>
            <p>
              we reserve the right to update this privacy policy at any time. changes will be reflected on this page.
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
}

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Demande, DemandeStatus } from './entities/contact-request.entity';
import { CreateDemandeDto } from './dto/create-contact-request.dto';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

import nodemailer from 'nodemailer';

@Injectable()
export class DemandeService {
  constructor(
    @InjectRepository(Demande)
    private demandeRepository: Repository<Demande>,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createDemandeDto: CreateDemandeDto): Promise<Demande> {
    const demande = this.demandeRepository.create({
      ...createDemandeDto,
      status: DemandeStatus.PENDING,
    });
    const saved = await this.demandeRepository.save(demande);

    // Fire-and-forget notifications
    this.sendNotifications(saved).catch((err) => {
      Logger.warn(`Demande notifications failed: ${err instanceof Error ? err.message : String(err)}`);
    });

    return saved;
  }

  async createWithImages(createDemandeDto: CreateDemandeDto, files: Express.Multer.File[]): Promise<Demande> {
    let imageUrls: string[] = [];
    
    if (files && files.length > 0) {
      // Upload images to Cloudinary
      const uploadPromises = files.map(file => this.cloudinaryService.uploadImageWithResult(file, 'exped360-demandes'));
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map(result => result.secure_url);
    }

    const demande = this.demandeRepository.create({
      ...createDemandeDto,
      images: imageUrls,
      status: DemandeStatus.PENDING,
    });
    
    const saved = await this.demandeRepository.save(demande);

    // Fire-and-forget notifications
    this.sendNotifications(saved).catch((err) => {
      Logger.warn(`Demande notifications failed: ${err instanceof Error ? err.message : String(err)}`);
    });

    return saved;
  }

  async findAll(): Promise<Demande[]> {
    return this.demandeRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Demande> {
    const demande = await this.demandeRepository.findOne({
      where: { id },
    });

    if (!demande) {
      throw new NotFoundException(`Demande with ID ${id} not found`);
    }

    return demande;
  }

  async updateStatus(id: string, status: DemandeStatus): Promise<Demande> {
    const demande = await this.findOne(id);
    demande.status = status;
    return this.demandeRepository.save(demande);
  }

  async remove(id: string): Promise<void> {
    const demande = await this.findOne(id);
    
    // Delete images from Cloudinary if they exist
    if (demande.images && demande.images.length > 0) {
      const deletePromises = demande.images.map(imageUrl => {
        const publicId = this.cloudinaryService.getPublicIdFromUrl(imageUrl);
        if (publicId) {
          return this.cloudinaryService.deleteImage(publicId);
        }
        return Promise.resolve();
      });
      await Promise.all(deletePromises);
    }

    const result = await this.demandeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Demande with ID ${id} not found`);
    }
  }

  async getAnalytics(): Promise<{ total: number; pending: number; processed: number; rejected: number; last7Days: number; }> {
    const [total, pending, processed, rejected, last7Days] = await Promise.all([
      this.demandeRepository.count(),
      this.demandeRepository.count({ where: { status: DemandeStatus.PENDING } }),
      this.demandeRepository.count({ where: { status: DemandeStatus.PROCESSED } }),
      this.demandeRepository.count({ where: { status: DemandeStatus.REJECTED } }),
      this.demandeRepository.count({
        where: {
          createdAt: ((): any => {
            const d = new Date();
            d.setDate(d.getDate() - 7);
            return (d as any);
          })(),
        } as any,
      }),
    ]);
    return { total, pending, processed, rejected, last7Days };
  }

  private async sendNotifications(demande: Demande): Promise<void> {
    // Only send email if emailContact is true
    if (demande.emailContact) {
      await this.sendEmailNotification(demande);
    }
  }

  private async sendEmailNotification(demande: Demande): Promise<void> {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<string>('SMTP_PORT');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const to = this.configService.get<string>('CONTACT_RECIPIENT_EMAIL');
    if (!host || !port || !user || !pass || !to) {
      Logger.log('SMTP not configured, skipping email notification');
      return;
    }

    const makeTransporter = (p: number, secure: boolean) => nodemailer.createTransport({
      host,
      port: p,
      secure,
      auth: { user, pass },
      authMethod: 'LOGIN',
      tls: { minVersion: 'TLSv1.2' },
    } as any);

    const initialPort = Number(port);
    const initialSecure = initialPort === 465;
    let transporter = makeTransporter(initialPort, initialSecure);
    try {
      await transporter.verify();
      Logger.log(`SMTP verified: host=${host} port=${initialPort} secure=${initialSecure}`);
    } catch (e: any) {
      Logger.warn(`SMTP verify failed on port ${initialPort} (secure=${initialSecure}): ${e?.message || e}`);
      // Retry with STARTTLS on 587 if first verify fails
      if (initialPort !== 587) {
        try {
          transporter = makeTransporter(587, false);
          await transporter.verify();
          Logger.log('SMTP verified on fallback port 587 (STARTTLS)');
        } catch (e2: any) {
          Logger.warn(`SMTP fallback verify failed on port 587: ${e2?.message || e2}`);
          throw e2;
        }
      } else {
        throw e;
      }
    }

    // Determine if this is a vendre-louer demande (has actual property type) vs contact form
    const propertyTypes = ['apartment', 'villa', 'studio', 'house', 'land', 'commercial'];
    const isVendreLouer = demande.propertyType && propertyTypes.includes(demande.propertyType.toLowerCase());
    
    const headerText = isVendreLouer 
      ? 'Nouvelle demande (Vendre/Louer)' 
      : 'Nouvelle demande de contact';
    const subject = isVendreLouer
      ? `Nouvelle demande - ${demande.propertyIntention === 'sell' ? 'Vendre' : 'Louer'} - ${demande.name}`
      : `Nouvelle demande de contact: ${demande.name}`;
    
    const text = `${headerText}\n\n` +
      `Nom: ${demande.name}\n` +
      `Email: ${demande.email}\n` +
      `Téléphone: ${demande.phone || '-'}\n` +
      `Type de bien: ${demande.propertyType}\n` +
      `Localisation: ${demande.propertyLocation}\n` +
      `Intention: ${demande.propertyIntention === 'sell' ? 'Vendre' : 'Louer'}\n` +
      `WhatsApp: ${demande.whatsappContact ? 'Oui' : 'Non'}\n` +
      `Contact par email: ${demande.emailContact ? 'Oui' : 'Non'}\n` +
      `Images: ${demande.images && demande.images.length > 0 ? demande.images.length + ' uploadées' : 'Aucune'}\n` +
      `Message:\n${demande.message || '-'}`;

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#111827">
        <h2 style="margin:0 0 12px">${headerText}</h2>
        <p style="margin:0 0 16px">Vous avez reçu une nouvelle demande depuis le site VisiteHub.</p>
        <table style="border-collapse:collapse;width:100%">
          <tbody>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;width:220px">Nom</td><td style="padding:8px;border:1px solid #e5e7eb">${demande.name}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb">Email</td><td style="padding:8px;border:1px solid #e5e7eb">${demande.email}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb">Téléphone</td><td style="padding:8px;border:1px solid #e5e7eb">${demande.phone || '-'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb">Type de bien</td><td style="padding:8px;border:1px solid #e5e7eb">${demande.propertyType || '-'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb">Localisation</td><td style="padding:8px;border:1px solid #e5e7eb">${demande.propertyLocation || '-'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb">Intention</td><td style="padding:8px;border:1px solid #e5e7eb">${demande.propertyIntention === 'sell' ? 'Vendre' : 'Louer'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb">WhatsApp</td><td style="padding:8px;border:1px solid #e5e7eb">${demande.whatsappContact ? 'Oui' : 'Non'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb">Contact par email</td><td style="padding:8px;border:1px solid #e5e7eb">${demande.emailContact ? 'Oui' : 'Non'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb">Images</td><td style="padding:8px;border:1px solid #e5e7eb">${demande.images && demande.images.length > 0 ? `${demande.images.length} uploadées` : 'Aucune'}</td></tr>
          </tbody>
        </table>
        <div style="margin-top:16px">
          <div style="padding:8px 0;font-weight:600">Message</div>
          <div style="white-space:pre-line;border:1px solid #e5e7eb;border-radius:8px;padding:12px">${(demande.message || '-').replace(/</g,'&lt;')}</div>
        </div>
      </div>`;

    try {
      await transporter.sendMail({
        from: user,
        to,
        subject,
        text,
        html,
        replyTo: demande.email || undefined,
      });
    } catch (err: any) {
      // If auth error occurs during send, retry once with STARTTLS
      const isAuthError = err?.code === 'EAUTH' || /535/i.test(err?.response || '') || /Invalid login/i.test(err?.message || '');
      if (isAuthError && !(initialPort === 587)) {
        Logger.warn(`SendMail auth failed on port ${initialPort}, retrying on 587...`);
        const fallback = makeTransporter(587, false);
        await fallback.verify().catch(() => {});
        await fallback.sendMail({
          from: user,
          to,
          subject,
          text,
          html,
          replyTo: demande.email || undefined,
        });
      } else {
        throw err;
      }
    }

    // Auto-reply to the sender (if email provided and emailContact is true)
    if (demande.email && demande.emailContact) {
      const autoReplyHtml = `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#111827">
          <h2 style="margin:0 0 12px">Merci pour votre message</h2>
          <p>Bonjour ${demande.name?.split(' ')[0] || ''},</p>
          <p>Nous avons bien reçu votre demande et nous vous répondrons sous 24 heures.</p>
          <p style="margin:16px 0 8px;font-weight:600">Récapitulatif</p>
          <ul>
            <li><strong>Sujet:</strong> ${demande.propertyType || 'Contact'}</li>
            <li><strong>Message:</strong> ${(demande.message || '-').replace(/</g,'&lt;')}</li>
          </ul>
          <p>Cordialement,<br/>L'équipe VisiteHub</p>
        </div>`;

      await transporter.sendMail({
        from: user,
        to: demande.email,
        subject: 'Nous avons bien reçu votre message',
        text: 'Nous avons bien reçu votre message et nous vous répondrons sous 24 heures.',
        html: autoReplyHtml,
      });
    }
  }
}
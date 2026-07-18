import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { projectsAPI } from '../services/api';
import { WizardProgressBar } from '../components/projects/WizardProgressBar';
import { Step1ProjectInfo } from '../components/projects/Step1ProjectInfo';
import { Step2PlotDetails } from '../components/projects/Step2PlotDetails';
import { Step3StructuralDetails } from '../components/projects/Step3StructuralDetails';
import { Step4MaterialPreferences } from '../components/projects/Step4MaterialPreferences';
import { Step5LabourDetails } from '../components/projects/Step5LabourDetails';
import { Step6BudgetDetails } from '../components/projects/Step6BudgetDetails';
import { Step7Review } from '../components/projects/Step7Review';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Save, CheckCircle2 } from 'lucide-react';

const wizardSchema = z.object({
  title: z.string().min(3, 'Project title must be at least 3 characters'),
  client_name: z.string().min(2, 'Client name is required'),
  owner_name: z.string().optional(),
  project_type: z.string().optional(),
  description: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  google_maps_url: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  currency: z.string().optional(),
  measurement_units: z.string().optional(),
  built_up_area: z.number().min(100, 'Built-up area must be at least 100 sq ft'),
  total_budget: z.number().min(1000, 'Total budget must be at least $1,000'),
  plot_details: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    total_area: z.number().optional(),
    carpet_area: z.number().optional(),
    floors: z.number().optional(),
    basement_available: z.boolean().optional(),
    parking_area: z.number().optional(),
    open_area: z.number().optional(),
    road_facing: z.boolean().optional(),
    plot_shape: z.string().optional(),
    facing_direction: z.string().optional(),
  }).optional(),
  structural_details: z.object({
    foundation_type: z.string().optional(),
    concrete_grade: z.string().optional(),
    brick_type: z.string().optional(),
    wall_thickness: z.string().optional(),
    beam_size: z.string().optional(),
    column_size: z.string().optional(),
    slab_thickness: z.string().optional(),
    floor_height: z.number().optional(),
    door_count: z.number().optional(),
    window_count: z.number().optional(),
    staircase_count: z.number().optional(),
    lift_available: z.boolean().optional(),
    water_tank_capacity: z.number().optional(),
    septic_tank_available: z.boolean().optional(),
  }).optional(),
  material_preferences: z.object({
    cement_brand: z.string().optional(),
    steel_brand: z.string().optional(),
    brick_type: z.string().optional(),
    sand_type: z.string().optional(),
    paint_brand: z.string().optional(),
    pipe_brand: z.string().optional(),
    electrical_brand: z.string().optional(),
  }).optional(),
  labour_details: z.object({
    engineers: z.number().optional(),
    supervisors: z.number().optional(),
    masons: z.number().optional(),
    helpers: z.number().optional(),
    electricians: z.number().optional(),
    plumbers: z.number().optional(),
    painters: z.number().optional(),
    carpenters: z.number().optional(),
    total_labourers: z.number().optional(),
    expected_working_days: z.number().optional(),
    daily_labour_cost: z.number().optional(),
  }).optional(),
  budget_details: z.object({
    material_budget: z.number().optional(),
    labour_budget: z.number().optional(),
    emergency_fund: z.number().optional(),
    misc_budget: z.number().optional(),
    max_budget: z.number().optional(),
    estimated_budget: z.number().optional(),
  }).optional(),
});

type WizardFormData = z.infer<typeof wizardSchema>;

export const ProjectWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [createdId, setCreatedId] = useState<number | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema) as any,
    defaultValues: {
      title: '',
      client_name: '',
      project_type: 'Residential',
      city: '',
      currency: 'USD',
      measurement_units: 'Imperial (ft)',
      built_up_area: 1500,
      total_budget: 150000,
      plot_details: {
        length: 50,
        width: 40,
        total_area: 2000,
        floors: 2,
        plot_shape: 'Rectangular',
        facing_direction: 'North Facing'
      },
      structural_details: {
        foundation_type: 'Isolated Footing',
        concrete_grade: 'M20',
        brick_type: 'Standard Red Clay Brick',
        wall_thickness: '9 inches'
      },
      material_preferences: {
        cement_brand: 'UltraTech',
        steel_brand: 'Tata Tiscon',
        paint_brand: 'Asian Paints',
        pipe_brand: 'Astral',
        electrical_brand: 'Havells'
      },
      labour_details: {
        engineers: 1,
        supervisors: 1,
        masons: 4,
        helpers: 8,
        expected_working_days: 120,
        daily_labour_cost: 35
      },
      budget_details: {
        material_budget: 90000,
        labour_budget: 45000,
        emergency_fund: 10000,
        misc_budget: 5000
      }
    }
  });

  const nextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(['title', 'client_name', 'city']);
      if (!isValid) return;
    }
    if (step < 7) setStep((s) => s + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSaveDraft = async () => {
    const data = watch();
    try {
      const proj = await projectsAPI.create({
        ...data,
        status: 'Draft',
        location: `${data.city || ''}, ${data.state || ''}`
      });
      setCreatedId(proj.id);
      setSuccessModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data: WizardFormData) => {
    setSubmitting(true);
    try {
      const proj = await projectsAPI.create({
        ...data,
        status: 'In Progress',
        location: `${data.city}, ${data.state || ''}`.trim()
      });
      setCreatedId(proj.id);
      setSuccessModal(true);
    } catch (err) {
      console.error('Project submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header & Back Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Back to Projects
        </button>

        <button
          type="button"
          onClick={handleSaveDraft}
          className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" /> Save Draft
        </button>
      </div>

      {/* Progress Steps Header */}
      <WizardProgressBar currentStep={step} onStepClick={setStep} />

      {/* Form Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && <Step1ProjectInfo register={register} errors={errors} />}
              {step === 2 && <Step2PlotDetails register={register} setValue={setValue} watch={watch} />}
              {step === 3 && <Step3StructuralDetails register={register} />}
              {step === 4 && <Step4MaterialPreferences register={register} setValue={setValue} watch={watch} />}
              {step === 5 && <Step5LabourDetails register={register} watch={watch} setValue={setValue} />}
              {step === 6 && <Step6BudgetDetails register={register} watch={watch} setValue={setValue} />}
              {step === 7 && <Step7Review watch={watch} onGoToStep={setStep} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={prevStep}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {step < 7 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Creating Project...' : 'Submit & Initialize Project'} <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Project Initialized!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Project record stored in database with auto-generated ID #{createdId}.
            </p>

            <button
              onClick={() => navigate(`/projects/${createdId}`)}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
            >
              Go to Project Details Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

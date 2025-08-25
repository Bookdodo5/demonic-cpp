<script setup>
    import quizData from '@/quizData'
    import { ref, computed, onMounted, onUnmounted } from 'vue'
    import {
        Card,
        CardContent,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card"
    import {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogTrigger,
    } from '@/components/ui/alert-dialog'
    import { Button } from "@/components/ui/button"
    import { Input } from "@/components/ui/input"
    import { Label } from "@/components/ui/label"
    import { Separator } from '@/components/ui/separator'
    import * as Tone from "tone";

    const osc = new Tone.Oscillator(600, "sine").toDestination();
    
    // Quiz state
    const quizState = ref(-1); // -1 = waiting, 0 = enter, 1 = question, 2 = solution, 3 = finished
    const currentQuestionIndex = ref(0);
    const viewingQuestionIndex = ref(0);
    const selectedAnswer = ref([]);
    const score = ref(0);

    // Cheat state
    const cheatedTimeLeft = ref(10000);
    const timer = ref(null);
    const lastTickTime = ref(null);
    const failed = ref(false);

    // Form data
    const studentID = ref("");
    const studentIDError = ref("")
    const isStudentIDValid = computed(()=>/^\d{10}$/.test(studentID.value.trim()))
    
    const passcode = ref("");
    const passcodeError = ref("")
    const isPasscodeValid = computed(()=>/^[A-Za-z0-9]{6}$/.test(passcode.value.trim()))
    
    const startcode = ref("");
    const startcodeError = ref("")
    const isStartcodeValid = computed(()=>/^[A-Za-z0-9]{3}$/.test(startcode.value.trim()))
    
    // Validation
    const validateStudentID = () => {
        if (!studentID.value.trim()) {
            studentIDError.value = "Student ID is required";
        }
        else if (!isStudentIDValid.value) {
            studentIDError.value = "Student ID must be a 10-digit number";
        }
        else {
            studentIDError.value = "";
        }
    };
    
    const validatePasscode = () => {
        if (!passcode.value.trim()) {
            passcodeError.value = "Passcode is required";
        }
        else if (!isPasscodeValid.value) {
            passcodeError.value = "Passcode must have 6 English letters or numbers";
        }
        else {
            passcodeError.value = "";
        }
    };

    const validateStartcode = () => {
        if (!startcode.value.trim()) {
            startcodeError.value = "Startcode is required";
        }
        else if (!isStartcodeValid.value) {
            startcodeError.value = "Startcode must have 3 English letters or numbers";
        }
        else {
            startcodeError.value = "";
        }
    };

    const isFormValid = computed(() => {
        return isPasscodeValid.value && isStudentIDValid.value;
    });

    // Quiz logic
    const currentQuestion = computed(() => {
        return quizData.questions[currentQuestionIndex.value];
    });

    const viewingQuestion = computed(() => {
        return quizData.questions[viewingQuestionIndex.value];
    });

    const viewingAnswerIndex = computed(() => {
        if(viewingQuestionIndex.value < selectedAnswer.value.length) {
            return selectedAnswer.value[viewingQuestionIndex.value];
        }
        return -1;
    })

    const isViewingCorrect = computed(() => {
        return viewingQuestion.value.correctAnswer == viewingAnswerIndex.value;
    })

    const startQuiz = () => {
        if(quizState == -1 && !isFormValid.value) return;
        if(quizState == 0 && !isStartcodeValid.value) return;
        quizState.value++;
    };

    const selectChoice = (index) => {
        if(viewingQuestionIndex.value < selectedAnswer.value.length) {
            selectedAnswer.value[viewingQuestionIndex.value] = index;
        }
        else selectedAnswer.value = [...selectedAnswer.value, index];
    };
    
    const commitChoice = () => {
        quizState.value = 2;
        
        if (viewingAnswerIndex.value === currentQuestion.value.correctAnswer) {
            score.value++;
        }
        currentQuestionIndex.value++;
    };

    const nextQuestion = () => {
        if (viewingQuestionIndex.value === quizData.questions.length - 1) {
            quizState.value = 3;
            return;
        }
        viewingQuestionIndex.value++;
        if (viewingQuestionIndex.value >= currentQuestionIndex.value) {
            quizState.value = 1;
        }
    };

    const previousQuestion = () => {
        if (viewingQuestionIndex.value > 0) {
            viewingQuestionIndex.value--;
            quizState.value = 2;
        }
    };

    const onCheated = () => {
        if (timer.value !== null || quizState.value === 3 || quizState.value == -1 || failed.value) {
            return;
        }
        lastTickTime.value = Date.now();
        timer.value = setInterval(() => {
            const now = Date.now();
            const elapsed = now - lastTickTime.value;
            cheatedTimeLeft.value -= elapsed;
            lastTickTime.value = now;
            osc.start();

            if(cheatedTimeLeft.value < 0) {
                failed.value = true;
                quizState.value = 3;

                const synth = new Tone.Synth().toDestination();
                synth.triggerAttackRelease("C4", "8n");
                onUncheated();
            }
        }, 100);
    }

    const onUncheated = () => {
        osc.stop();
        if (timer.value !== null) {
            clearInterval(timer.value);
            timer.value = null;
        }
    }

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') onCheated();
        else onUncheated();
    }

    onMounted(() => {
        document.documentElement.addEventListener('mouseleave', onCheated);
        document.documentElement.addEventListener('mouseenter', onUncheated);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', onCheated);
        window.addEventListener('focus', onUncheated);
    });

    onUnmounted(() => {
        document.documentElement.removeEventListener('mouseleave', onCheated);
        document.documentElement.removeEventListener('mouseenter', onUncheated);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('blur', onCheated);
        window.removeEventListener('focus', onUncheated);
    });
</script>

<template>
    <div
        class="min-h-screen bg-[url(/low-poly-light.svg)] dark:bg-[url(/low-poly-dark.svg)] p-16 flex justify-center items-center"
    >
        <Card v-if="quizState==-1" class="font-mono min-w-lg max-w-lg bg-card/25 backdrop-blur-sm shadow-md py-8 px-4 gap-2">
            <CardHeader>
                <CardTitle class="text-center text-2xl font-bold">{{ quizData.title }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="space-y-2">
                    <Label class="font-bold">Student ID</Label>
                    <Input 
                        type="text" 
                        v-model="studentID" 
                        placeholder="Enter your student ID"
                        @blur="validateStudentID"
                        :class="{ 'border-red-500 focus:border-red-500': studentIDError }"
                    ></Input>
                    <p v-if="studentIDError" class="text-red-500 text-xs">{{ studentIDError }}</p>
                </div>
                <div class="space-y-2">
                    <Label class="font-bold">Passcode</Label>
                    <Input 
                        type="password" 
                        v-model="passcode" 
                        @blur="validatePasscode"
                        placeholder="Enter passcode"
                        :class="{ 'border-red-500 focus:border-red-500': passcodeError }"
                    ></Input>
                    <p v-if="passcodeError" class="text-red-500 text-xs">{{ passcodeError }}</p>
                </div>
            </CardContent>
            <CardFooter class="block">
                <Separator class="mt-4 mb-6" /> 
                <Button 
                    class="w-full" 
                    @click="startQuiz"
                    :disabled="!isFormValid"
                    :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
                >
                    Submit
                </Button>
            </CardFooter>
        </Card>

        <Card v-if="quizState==0" class="font-mono min-w-lg max-w-lg bg-card/25 backdrop-blur-sm shadow-md py-8 px-4 gap-2">
            <CardHeader>
                <CardTitle class="text-center text-2xl font-bold">{{ quizData.title }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
                <div
                    class="bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 p-4 rounded-md space-y-2 text-center"
                >
                    <h2 v-if="!failed" class="text-xl font-bold">*** Important ***</h2>
                    <p v-if="!failed" class="mt-4">Press F11 to go full screen.</p>
                    <p v-if="!failed">DO NOT LEAVE THIS PAGE.</p>
                    <p v-if="!failed">Enter the start code to start the quiz.</p>
                </div>
                <div class="space-y-2">
                    <Label class="font-bold">Start Code</Label>
                    <Input 
                        type="password" 
                        v-model="startcode" 
                        placeholder="Enter your student ID"
                        @blur="validateStartcode"
                        :class="{ 'border-red-500 focus:border-red-500': startcodeError }"
                    ></Input>
                    <p v-if="startcodeError" class="text-red-500 text-xs">{{ startcodeError }}</p>
                </div>
            </CardContent>
            <CardFooter class="block">
                <Separator class="mt-4 mb-6" /> 
                <Button 
                    class="w-full" 
                    @click="startQuiz"
                    :disabled="!isStartcodeValid"
                    :class="{ 'opacity-50 cursor-not-allowed': !isStartcodeValid }"
                >
                    Start Quiz
                </Button>
            </CardFooter>
        </Card>

        <Card v-else-if="quizState==1||quizState==2" class="font-mono min-w-2xl max-w-2xl bg-card/25 backdrop-blur-sm shadow-md py-8 px-4   gap-2">
            <CardHeader>
                <CardTitle class="text-center text-2xl font-bold">{{ quizData.title }} ({{ studentID }})</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
                <Separator class="mb-6" /> 
                <h2>{{ viewingQuestionIndex + 1 }}: {{ viewingQuestion.question }}</h2>
                <highlightjs
                    v-if="viewingQuestion.codeBlock"
                    language='javascript'
                    :code="viewingQuestion.codeBlock"
                    class="border border-border"
                />

                <div class="space-y-2 mt-6">
                    <Button
                        variant="ghost"
                        :key="index"
                        v-for="(option, index) in viewingQuestion.options"
                        class="min-h-12 h-fit w-full border-2 border-border justify-start whitespace-break-spaces text-left"
                        :class="{ 
                            '!border-l-4 !border-l-primary bg-secondary hover:!bg-secondary hover:!text-secondary-foreground    text-secondary-foreground border-accent': selectedAnswer[viewingQuestionIndex] === index 
                        }"
                        :disabled="quizState==2"
                        @click="()=>selectChoice(index)"
                    >
                        {{ option }}
                    </Button>
                </div>

                <div v-if="quizState==2" class="space-y-2">
                    <h2 class="text-xl font-bold">{{ isViewingCorrect? "Correct!" : "Incorrect!" }}</h2>
                    <p class="whitespace-pre-wrap">{{ viewingQuestion.explanation }}</p>
                </div>
            </CardContent>
            <CardFooter class="block">
                <Separator class="mt-4 mb-6" /> 
                <div class="flex gap-2">
                    <Button
                        variant="outline"
                        class="flex-1"
                        @click="previousQuestion"
                        :disabled="viewingQuestionIndex <= 0"
                        :class="{ 'opacity-50 cursor-not-allowed': viewingQuestionIndex <= 0 }"
                    >
                        Previous Question
                    </Button>
                    <Button
                        class="flex-1"
                        @click="() => { quizState == 1 ? commitChoice() : nextQuestion() }"
                        :disabled="viewingAnswerIndex < 0"
                        :class="{ 'opacity-50 cursor-not-allowed': viewingAnswerIndex < 0 }"
                    >
                        {{ quizState == 1 ? "Submit" :
                            viewingQuestionIndex === quizData.questions.length - 1 ? "View Results" : "Continue" }}
                    </Button>
                </div>
            </CardFooter>
        </Card>

        <Card v-else-if="quizState === 3" class="font-mono w-full min-w-2xl max-w-2xl bg-card/25 backdrop-blur-sm shadow-md py-8 px-4">
            <CardHeader>
                <CardTitle class="text-center text-2xl font-bold">
                    Quiz Submission: ({{ studentID }})
                </CardTitle>
            </CardHeader>
            <CardContent class="text-center">
                <div
                    class="bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 p-4 rounded-md space-y-2"
                    :class="{ '!bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400' : failed}"
                >
                    <p v-if="!failed">Success! Your answers have not been saved anywhere.</p>
                    <p v-if="!failed" class="mt-4">You got {{ score }}/{{ quizData.questions.length }} points.</p>
                    <h2 v-if="failed" class="text-xl font-bold">*** VIOLATION ***</h2>
                    <p v-if="failed">You switched away from the website (cheating)</p>
                    <p v-if="failed">Answers were automatically submitted.</p>
                    <p v-if="failed" class="mt-4">You got {{ score }}/{{ quizData.questions.length }} points.</p>
                </div>
            </CardContent>
        </Card>
    </div>
    <AlertDialog :open="timer">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle class="text-red-500 font-mono">
                    You left the page!
                </AlertDialogTitle>
                <Separator class="my-2" />
                <p class="text-center text-red-500 font-mono">
                    Return in {{ Math.floor(cheatedTimeLeft/1000) }}.{{ cheatedTimeLeft%1000 }} seconds...
                </p>
            </AlertDialogHeader>
        </AlertDialogContent>
    </AlertDialog>
</template>
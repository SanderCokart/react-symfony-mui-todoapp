<?php

namespace App\Service;

use App\Entity\Tag;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class CustomValidator
{
    /**
     * @var ValidatorInterface
     */
    private $validator;

    public function __construct(ValidatorInterface $validator)
    {
        $this->validator = $validator;
    }

    /**
     * @param Tag $tag
     * @param bool $listAllErrors set this to true to export an array of all errors instead of just the first error
     * @return array
     */
    public function validate(Tag $tag, bool $listAllErrors = false): array
    {
        $validatorErrors = $this->validator->validate($tag);

        $errors = [];
        if (sizeof($validatorErrors) > 0) {

            if ($listAllErrors) {
                foreach ($validatorErrors as $validatorError) {
                    $errors[] = $validatorError->getMessage();
                }
            } else {
                $errors[] = $validatorErrors[0]->getMessage();
            }
        }
        return $errors;
    }
}